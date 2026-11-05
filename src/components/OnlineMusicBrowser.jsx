import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Activity, Play, RefreshCw, Search, Wifi } from 'lucide-react';
import './MusicBrowser.css';

const JAMENDO_CLIENT_ID = '56d30c95'; // Public test ID
const FEATURED_QUERIES = ['electronic', 'ambient', 'cinematic', 'jazz'];

const formatTime = (seconds) => {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
};

export default function OnlineMusicBrowser() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState('trending');
  const [error, setError] = useState('');
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const fetchTrending = async () => {
    setActiveMood('trending');
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=20&boost=listens`);
      if (!response.ok) throw new Error('Jamendo request failed');
      const data = await response.json();
      if (data.results) {
        formatAndSetTracks(data.results);
      }
    } catch {
      setError('Online music could not load. Check the internet connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const searchMusic = async (term = query) => {
    const searchTerm = term.trim();
    if (!searchTerm) return fetchTrending();

    setActiveMood(searchTerm.toLowerCase());
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=24&include=musicinfo&audioformat=mp31&search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Jamendo search failed');
      const data = await response.json();
      if (data.results) {
        formatAndSetTracks(data.results);
      }
    } catch {
      setError('Search failed. Jamendo may be unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  const formatAndSetTracks = (results) => {
    const formatted = results.map(t => ({
      id: t.id,
      title: t.name,
      artist: t.artist_name,
      image: t.image,
      audioUrl: t.audio,
      duration: Number(t.duration) || 0,
      album: t.album_name,
      source: 'jamendo',
    }));
    setTracks(formatted);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchTrending();
    }, 0);

    return () => window.clearTimeout(timer);
    // Run once on mount to seed the online library.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="browser-container">
      <header className="screen-topbar">
        <div>
          <p className="eyebrow">JAMENDO STREAM</p>
          <h1 className="display-lg">Online</h1>
        </div>
        <button className="icon-button ghost" onClick={fetchTrending} aria-label="Refresh online tracks">
          <RefreshCw size={20} />
        </button>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="status-pill">
            <Wifi size={14} />
            no backend
          </span>
          <h2>Free online music, streamed directly in the APK.</h2>
          <p>Royalty-free tracks load from Jamendo over HTTPS. Nothing here needs your own server.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <Activity size={80} />
        </div>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          searchMusic();
        }}
        className="search-bar-container"
      >
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search Jamendo tracks or artists"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </form>

      <div className="chip-row" aria-label="Quick online searches">
        <button className={`chip ${activeMood === 'trending' ? 'active' : ''}`} onClick={fetchTrending}>Trending</button>
        {FEATURED_QUERIES.map((mood) => (
          <button
            key={mood}
            className={`chip ${activeMood === mood ? 'active' : ''}`}
            onClick={() => {
              setQuery(mood);
              searchMusic(mood);
            }}
          >
            {mood}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading streams...</div>
      ) : error ? (
        <div className="empty-state compact">
          <h2>Connection issue</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={fetchTrending}>Retry</button>
        </div>
      ) : (
        <div className="track-list">
          {tracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div 
                key={track.id} 
                className={`track-item ${isCurrent ? 'active' : ''}`}
                onClick={() => playTrack(track, tracks)}
              >
                <img src={track.image} alt={track.title} className="track-image" />
                <div className="track-details">
                  <div className="track-title">{track.title}</div>
                  <div className="track-artist">{track.artist}</div>
                </div>
                <div className="track-meta">
                  <span>{formatTime(track.duration)}</span>
                  {isCurrent && isPlaying ? (
                    <div className="playing-indicator">ON AIR</div>
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
