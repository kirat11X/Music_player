import { NavLink, Outlet } from 'react-router-dom';
import { Library, Radio, Disc3 } from 'lucide-react';
import PlayerControls from './PlayerControls';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>

      <PlayerControls />

      <nav className="bottom-nav liquid-glass">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Radio size={22} />
          <span className="nav-label">Online</span>
        </NavLink>
        
        <NavLink 
          to="/local" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Library size={22} />
          <span className="nav-label">Library</span>
        </NavLink>

        <NavLink
          to="/player"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Disc3 size={22} />
          <span className="nav-label">Player</span>
        </NavLink>
      </nav>
    </div>
  );
}
