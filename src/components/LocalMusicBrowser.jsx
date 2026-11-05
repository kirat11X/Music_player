import { useState, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FolderOpen, HardDrive, Music, Play, Smartphone, FileAudio, Loader } from 'lucide-react';
import { isNativeMusicLibraryAvailable, pickAndroidMusicFolder } from '../plugins/MusicLibrary';
import './MusicBrowser.css';

const AUDIO_FILE_PATTERN = /\.(mp3|m4a|aac|wav|ogg|opus|flac|webm|oga|wma)$/i;

export default function LocalMusicBrowser() {
  const [tracks, setTracks] = useState([]);
  const [folderLabel, setFolderLabel] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const handleFilesArray = (files, label = 'Local files') => {
    const audioFiles = files.filter(
      (file) => file.type.startsWith('audio/') || AUDIO_FILE_PATTERN.test(file.name)
    );

    if (!audioFiles.length) {
      setError('No supported audio files were found in that selection.');
      return;
    }

    const localTracks = audioFiles.map((file, index) => {
      const title = file.name.replace(/\.[^/.]+$/, '');
      const pathFolder = file.webkitRelativePath
        ? file.webkitRelativePath.split('/').slice(0, -1).join('/')
        : '';
      return {
        id: `local-${index}-${Date.now()}`,
        title: title,
        artist: pathFolder || label,
        image: null,
        file: file,
        audioUrl: null,
        size: file.size,
        source: 'web-folder',
      };
    });

    setTracks(localTracks);
    setFolderLabel(label);
    setError('');
  };

  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const rootName = files[0]?.webkitRelativePath?.split('/')[0] || 'Selected folder';
    handleFilesArray(files, rootName);
    e.target.value = '';
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    handleFilesArray(files, `${files.length} audio file${files.length > 1 ? 's' : ''}`);
    e.target.value = '';
  };

  const scanDirectoryHandle = async (dirHandle, currentPath = '') => {
    const collected = [];
    for await (const entry of dirHandle.values()) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
      if (entry.kind === 'file') {
        if (AUDIO_FILE_PATTERN.test(entry.name)) {
          try {
            const file = await entry.getFile();
            collected.push({ file, relPath: entryPath });
          } catch (e) {
            console.warn('Skipping unreadable file:', entry.name, e);
          }
        }
      } else if (entry.kind === 'directory') {
        try {
          const subEntries = await scanDirectoryHandle(entry, entryPath);
          collected.push(...subEntries);
        } catch (e) {
          console.warn('Skipping unreadable folder:', entry.name, e);
        }
      }
    }
    return collected;
  };

  const pickWebDirectoryAccess = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        setLoading(true);
        setError('');
        const dirHandle = await window.showDirectoryPicker();
        const entries = await scanDirectoryHandle(dirHandle, dirHandle.name);
        setLoading(false);

        if (!entries.length) {
          setError(`No supported audio files found in "${dirHandle.name}".`);
          return;
        }

        const localTracks = entries.map((item, index) => {
          const title = item.file.name.replace(/\.[^/.]+$/, '');
          const folderPart = item.relPath.split('/').slice(0, -1).join('/');
          return {
            id: `fs-${index}-${Date.now()}`,
            title: title,
            artist: folderPart || dirHandle.name,
            image: null,
            file: item.file,
            audioUrl: null,
            size: item.file.size,
            source: 'web-folder',
          };
        });

        setTracks(localTracks);
        setFolderLabel(dirHandle.name);
        setError('');
        return;
      } catch (err) {
        setLoading(false);
        if (err.name === 'AbortError') {
          return;
        }
        console.warn('showDirectoryPicker failed, falling back to file input:', err);
      }
    }

    folderInputRef.current?.click();
  };

  const pickNativeFolder = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await pickAndroidMusicFolder();
      setTracks(result.tracks || []);
      setFolderLabel('Android music folder');
      if (!result.tracks || !result.tracks.length) {
        setError('The selected Android folder did not contain supported audio files.');
      }
    } catch {
      setError('Folder access was cancelled or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const openFolderPicker = () => {
    if (isNativeMusicLibraryAvailable()) {
      pickNativeFolder();
    } else {
      pickWebDirectoryAccess();
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const formatSize = (size) => {
    if (!size) return 'LOCAL';
    return `${Math.max(size / 1024 / 1024, 0.1).toFixed(1)} MB`;
  };

  return (
    <div className="browser-container">
      <header className="screen-topbar">
        <div>
          <p className="eyebrow">DEVICE AUDIO</p>
          <h1 className="display-lg">Library</h1>
        </div>
        <div className="topbar-icon">
          {isNativeMusicLibraryAvailable() ? <Smartphone size={22} /> : <HardDrive size={22} />}
        </div>
      </header>

      <section className="hero-panel local-hero">
        <div className="hero-copy">
          <span className="status-pill">
            <FolderOpen size={14} />
            filesystem access
          </span>
          <h2>Load any music folder directly from your storage.</h2>
          <p>
            Full file system access supported: native document tree scanner on Android, and
            File System Access API (`showDirectoryPicker`) / directory picker on Web & Vercel.
          </p>
        </div>
      </section>

      <div className="local-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input 
          type="file" 
          webkitdirectory="true" 
          directory="true" 
          multiple 
          ref={folderInputRef}
          onChange={handleFolderSelect}
          style={{ display: 'none' }}
        />
        <input 
          type="file" 
          accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus,.flac,.webm,.oga" 
          multiple 
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button 
          className="primary-button"
          onClick={openFolderPicker}
          disabled={loading}
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <FolderOpen size={18} />}
          {loading ? 'Scanning folder...' : 'Select folder'}
        </button>
        <button 
          className="secondary-button"
          onClick={openFilePicker}
          disabled={loading}
          style={{
            minHeight: '48px',
            borderRadius: '999px',
            padding: '0 1.25rem',
            background: 'var(--surface-high)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '550',
            cursor: 'pointer'
          }}
        >
          <FileAudio size={18} />
          Select audio files
        </button>
      </div>

      {error && (
        <div className="notice-panel">
          {error}
        </div>
      )}

      {tracks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-container">
            <Music size={48} className="empty-icon" />
          </div>
          <h2>No local music loaded</h2>
          <p>Select a folder or audio files (MP3, M4A, WAV, OGG, OPUS, AAC, FLAC) from your local drive.</p>
        </div>
      ) : (
        <div className="track-list">
          <div className="section-meta">
            {tracks.length} TRACKS // {folderLabel || 'SELECTED FOLDER'}
          </div>
          {tracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div 
                key={track.id} 
                className={`track-item ${isCurrent ? 'active' : ''}`}
                onClick={() => playTrack(track, tracks)}
              >
                <div className="local-track-icon">
                  {isCurrent && isPlaying ? <div className="equalizer-mark" /> : <Music size={22} />}
                </div>
                <div className="track-details">
                  <div className="track-title">{track.title}</div>
                  <div className="track-artist">{track.artist}</div>
                </div>
                <div className="track-meta">
                  <span>{formatSize(track.size)}</span>
                  {isCurrent && isPlaying ? (
                    <div className="playing-indicator">PLAYING</div>
                  ) : (
                    <button className="icon-button small" aria-label={`Play ${track.title}`}>
                      <Play size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
