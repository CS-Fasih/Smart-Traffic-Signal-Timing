import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/simulator', label: 'Simulator', icon: '🚦' },
  { path: '/optimizer', label: 'Optimizer', icon: '🧬' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/comparison', label: 'Comparison', icon: '⚖️' },
  { path: '/methodology', label: 'Methodology', icon: '📝' },
  { path: '/team', label: 'Team', icon: '👥' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🧬</span>
          <span className="brand-text">
            <span className="brand-title">TrafficGA</span>
            <span className="brand-subtitle">Evolutionary Optimizer</span>
          </span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${mobileOpen ? 'active' : ''}`} />
        </button>
      </div>
    </nav>
  );
}
