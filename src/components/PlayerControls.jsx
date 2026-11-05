import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import './PlayerControls.css';

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function PlayerControls() {
  const navigate = useNavigate();
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    duration, 
    togglePlayPause, 
    playNext, 
    playPrev, 
    seek,
    volume,
    changeVolume
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="player-controls-container">
      <div className="progress-container">
        <span className="time-text">{formatTime(progress)}</span>
        <input 
          type="range" 
          min={0} 
          max={duration || 0} 
          value={progress || 0} 
          onChange={(e) => seek(Number(e.target.value))}
          className="scrubber"
        />
        <span className="time-text">{formatTime(duration)}</span>
      </div>

      <div className="controls-main">
        <button className="track-info" onClick={() => navigate('/player')}>
          {currentTrack.image ? (
            <img src={currentTrack.image} alt="Album Art" className="album-art" />
          ) : (
            <div className="album-art placeholder">{currentTrack.title.slice(0, 1).toUpperCase()}</div>
          )}
          <div className="track-text">
            <div className="track-title">{currentTrack.title}</div>
            <div className="track-artist">{currentTrack.artist}</div>
          </div>
        </button>

        <div className="playback-buttons">
          <button className="icon-button ghost" onClick={playPrev} aria-label="Previous track">
            <SkipBack size={24} />
          </button>
          <button className="icon-button primary play-pause" onClick={togglePlayPause} aria-label="Play or pause">
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="play-icon" />}
          </button>
          <button className="icon-button ghost" onClick={playNext} aria-label="Next track">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="volume-controls">
          <Volume2 size={20} className="volume-icon" />
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01} 
            value={volume} 
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
