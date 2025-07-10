import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const getSystemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || getSystemTheme());

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo" aria-label="StreamZone logo" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="14" fill="#ffd700"/>
            <polygon points="11,8 22,14 11,20" fill="#232b5d"/>
          </svg>
        </span>
        Stream<span className="brand-accent">Zone</span>
      </Link>
      <button
        onClick={toggleTheme}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          marginRight: '18px',
          color: theme === 'dark' ? '#ffd700' : '#222',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
        aria-label="Toggle dark/light mode"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
      </button>
      <ul className="navbar-nav">
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <span className="welcome-user">Welcome, {user?.username}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
