package com.kirat.musicapp;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.DocumentsContract;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Locale;

@CapacitorPlugin(name = "MusicLibrary")
public class MusicLibraryPlugin extends Plugin {
    private static final String[] AUDIO_EXTENSIONS = {
        "mp3", "m4a", "aac", "wav", "ogg", "opus", "flac", "webm", "oga", "wma"
    };
    private static final int MAX_SCAN_DEPTH = 15;
    private static final int MAX_TRACKS_LIMIT = 10000;

    @PluginMethod
    public void pickFolder(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);
        startActivityForResult(call, intent, "folderPicked");
    }

    @ActivityCallback
    private void folderPicked(PluginCall call, androidx.activity.result.ActivityResult result) {
        if (call == null) {
            return;
        }

        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("No folder selected.");
            return;
        }

        Uri treeUri = result.getData().getData();
        if (treeUri == null) {
            call.reject("Selected folder could not be opened.");
            return;
        }

        ContentResolver resolver = getContext().getContentResolver();
        int flags = result.getData().getFlags()
            & (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

        try {
            resolver.takePersistableUriPermission(treeUri, flags & Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } catch (SecurityException ignored) {
            // Some document providers grant temporary access only. The current session still works.
        }

        String rootDocumentId = getRootDocumentId(treeUri);
        JSArray tracks = new JSArray();
        if (rootDocumentId != null) {
            collectAudioDocuments(resolver, treeUri, rootDocumentId, tracks, 0);
        }

        JSObject ret = new JSObject();
        ret.put("folderUri", treeUri.toString());
        ret.put("tracks", tracks);
        call.resolve(ret);
    }

    private String getRootDocumentId(Uri treeUri) {
        try {
            return DocumentsContract.getTreeDocumentId(treeUri);
        } catch (Exception e) {
            try {
                return DocumentsContract.getDocumentId(treeUri);
            } catch (Exception ex) {
                return null;
            }
        }
    }

    private void collectAudioDocuments(ContentResolver resolver, Uri treeUri, String parentDocumentId, JSArray tracks, int depth) {
        if (parentDocumentId == null || depth > MAX_SCAN_DEPTH || tracks.length() >= MAX_TRACKS_LIMIT) {
            return;
        }

        Uri childrenUri = DocumentsContract.buildChildDocumentsUriUsingTree(treeUri, parentDocumentId);

        String[] projection = new String[] {
            DocumentsContract.Document.COLUMN_DOCUMENT_ID,
            DocumentsContract.Document.COLUMN_DISPLAY_NAME,
            DocumentsContract.Document.COLUMN_MIME_TYPE,
            DocumentsContract.Document.COLUMN_SIZE,
            DocumentsContract.Document.COLUMN_LAST_MODIFIED
        };

        try (Cursor cursor = resolver.query(childrenUri, projection, null, null, null)) {
            if (cursor == null) {
                return;
            }

            int idIndex = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_DOCUMENT_ID);
            int nameIndex = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_DISPLAY_NAME);
            int mimeIndex = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_MIME_TYPE);
            int sizeIndex = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_SIZE);
            int modifiedIndex = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_LAST_MODIFIED);

            while (cursor.moveToNext() && tracks.length() < MAX_TRACKS_LIMIT) {
                String childId = readString(cursor, idIndex);
                String name = readString(cursor, nameIndex);
                String mime = readString(cursor, mimeIndex);
                if (childId == null) {
                    continue;
                }

                if (DocumentsContract.Document.MIME_TYPE_DIR.equals(mime)) {
                    collectAudioDocuments(resolver, treeUri, childId, tracks, depth + 1);
                } else if (isAudioFile(name, mime)) {
                    Uri documentUri = DocumentsContract.buildDocumentUriUsingTree(treeUri, childId);
                    JSObject track = new JSObject();
                    track.put("id", "android-" + childId);
                    track.put("title", stripExtension(name));
                    track.put("artist", "Local folder");
                    track.put("uri", documentUri.toString());
                    track.put("mimeType", mime != null ? mime : "audio/mpeg");
                    track.put("size", readLong(cursor, sizeIndex));
                    track.put("modified", readLong(cursor, modifiedIndex));
                    tracks.put(track);
                }
            }
        } catch (Exception ignored) {
            // Skip unreadable subfolders and keep returning playable files
        }
    }

    private boolean isAudioFile(String name, String mime) {
        if (mime != null) {
            String lowerMime = mime.toLowerCase(Locale.ROOT);
            if (lowerMime.startsWith("audio/") || lowerMime.contains("ogg") || lowerMime.contains("flac")) {
                return true;
            }
        }

        String extension = getFileExtension(name);
        if (extension == null) {
            return false;
        }

        for (String audioExtension : AUDIO_EXTENSIONS) {
            if (audioExtension.equals(extension)) {
                return true;
            }
        }
        return false;
    }

    private String getFileExtension(String name) {
        if (name == null) {
            return null;
        }

        String trimmedName = name.trim();
        int dotIndex = trimmedName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == trimmedName.length() - 1) {
            return null;
        }
        return trimmedName.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
    }

    private String stripExtension(String name) {
        if (name == null) {
            return "Untitled";
        }

        int dotIndex = name.lastIndexOf('.');
        return dotIndex > 0 ? name.substring(0, dotIndex) : name;
    }

    private long readLong(Cursor cursor, int index) {
        return index >= 0 && !cursor.isNull(index) ? cursor.getLong(index) : 0L;
    }

    private String readString(Cursor cursor, int index) {
        return index >= 0 && !cursor.isNull(index) ? cursor.getString(index) : null;
    }
}
