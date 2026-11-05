import { Capacitor, registerPlugin } from '@capacitor/core';

const NativeMusicLibrary = registerPlugin('MusicLibrary');

export const isNativeMusicLibraryAvailable = () => Capacitor.getPlatform() === 'android';

export const pickAndroidMusicFolder = async () => {
  const result = await NativeMusicLibrary.pickFolder();

  return {
    folderUri: result.folderUri,
    tracks: (result.tracks || []).map((track) => ({
      id: track.id,
      title: track.title || 'Untitled',
      artist: track.artist || 'Local folder',
      image: null,
      source: 'android-folder',
      nativeUri: track.uri,
      audioUrl: Capacitor.convertFileSrc(track.uri),
      mimeType: track.mimeType,
      size: track.size || 0,
      modified: track.modified || 0,
    })),
  };
};
