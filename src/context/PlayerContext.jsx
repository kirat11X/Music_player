/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useRef, useEffect, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackError, setPlaybackError] = useState('');

  const audioRef = useRef(new Audio());

  const playTrack = (track, trackQueue = null) => {
    const audio = audioRef.current;

    let audioSrc = track.audioUrl;
    if (track.file) {
      if (!track.audioUrl) {
        track.audioUrl = URL.createObjectURL(track.file);
        audioSrc = track.audioUrl;
      }
    }

    if (!audioSrc) {
      setPlaybackError('No playable audio source was found for this track.');
      return;
    }

    setPlaybackError('');
    setCurrentTrack(track);
    setProgress(0);
    setDuration(track.duration || 0);

    if (trackQueue) {
      setQueue(trackQueue);
      setCurrentIndex(trackQueue.findIndex((t) => t.id === track.id));
    }

    audio.src = audioSrc;
    audio.volume = volume;
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
        setPlaybackError('Playback was blocked or failed. Tap play again or choose another track.');
      });
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setPlaybackError('');
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setPlaybackError('Playback was blocked or failed. Tap a track again to retry.'));
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playTrack(queue[nextIndex]);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      if (audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
      } else {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        playTrack(queue[prevIndex]);
      }
    } else if (currentTrack) {
      audioRef.current.currentTime = 0;
    }
  };

  const seek = (time) => {
    if (!Number.isFinite(time)) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime || 0);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const handleEnded = () => playNext();
    const handleError = () => {
      setIsPlaying(false);
      setPlaybackError('This track could not be played. Try another file or stream.');
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
    // The listener should refresh when queue position changes; playNext reads those same values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex]);

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    queue,
    currentIndex,
    playbackError,
    playTrack,
    togglePlayPause,
    playNext,
    playPrev,
    seek,
    changeVolume,
    setQueue
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
