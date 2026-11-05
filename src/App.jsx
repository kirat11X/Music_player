import { HashRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/Layout';
import OnlineMusicBrowser from './components/OnlineMusicBrowser';
import LocalMusicBrowser from './components/LocalMusicBrowser';
import NowPlaying from './components/NowPlaying';

function App() {
  return (
    <PlayerProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OnlineMusicBrowser />} />
            <Route path="local" element={<LocalMusicBrowser />} />
            <Route path="player" element={<NowPlaying />} />
          </Route>
        </Routes>
      </HashRouter>
    </PlayerProvider>
  );
}

export default App;
