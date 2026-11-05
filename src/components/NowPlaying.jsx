import { Link } from 'react-router-dom';
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './NowPlaying.css';

const formatTime = (time) => {
  if (!time || Number.isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export default function NowPlaying() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    playbackError,
    togglePlayPause,
    playNext,
    playPrev,
    seek,
  } = usePlayer();

  const progressPercent = duration ? Math.min((progress / duration) * 100, 100) : 0;
  const displayTrack = currentTrack || {
    title: 'No track loaded',
    artist: 'Start from Online or Library',
    image: null,
  };

  return (
    <div className="now-playing-screen">
      <header className="now-header">
        <Link to="/" className="text-link">Online</Link>
        <span className="now-kicker">NOW PLAYING</span>
        <Link to="/local" className="text-link">Library</Link>
      </header>

      <main className="now-canvas">
        <section className="album-stage">
          {displayTrack.image ? (
            <img src={displayTrack.image} alt={displayTrack.title} className="now-art" />
          ) : (
            <div className="now-art placeholder">
              <span>{displayTrack.title.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
        </section>

        <section className="now-meta">
          <h1>{displayTrack.title}</h1>
          <p>{displayTrack.artist}</p>
        </section>

        <section className="seek-section">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress || 0}
            onChange={(event) => seek(Number(event.target.value))}
            className="now-scrubber"
            style={{ '--progress': `${progressPercent}%` }}
            disabled={!currentTrack}
            aria-label="Seek current track"
          />
          <div className="time-row">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </section>

        {playbackError && <p className="player-error">{playbackError}</p>}

        <section className="now-controls" aria-label="Playback controls">
          <button className="icon-button ghost" aria-label="Shuffle">
            <Shuffle size={24} />
          </button>
          <button className="icon-button ghost large" onClick={playPrev} aria-label="Previous track">
            <SkipBack size={32} />
          </button>
          <button className="icon-button primary jumbo" onClick={togglePlayPause} disabled={!currentTrack} aria-label="Play or pause">
            {isPlaying ? <Pause size={38} /> : <Play size={38} className="play-icon" />}
          </button>
          <button className="icon-button ghost large" onClick={playNext} aria-label="Next track">
            <SkipForward size={32} />
          </button>
          <button className="icon-button ghost" aria-label="Repeat">
            <Repeat size={24} />
          </button>
        </section>
      </main>
    </div>
  );
}
