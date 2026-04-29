import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import IntroPage from './components/IntroPage';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import PostPage from './components/PostPage';
import NewsPage from './components/NewsPage';
import ServicesPage from './components/ServicesPage';
import AccountPage from './components/AccountPage';
import ChatListPage from './components/ChatListPage';
import './App.css';

/* ── SVG icon components ──────────────────────────────── */

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ── Nav item definitions with inline SVG icons ───────── */

const navItems = [
  {
    path: '/feed',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/post',
    label: 'New Post',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    path: '/news',
    label: 'News',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    path: '/services',
    label: 'Services',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z" />
      </svg>
    ),
  },
  {
    path: '/chats',
    label: 'Messages',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    path: '/account',
    label: 'Profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/* ── App ──────────────────────────────────────────────── */

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  /* Sync theme attribute + localStorage */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  /* Auto-login if driverData exists */
  useEffect(() => {
    try {
      const driverData = localStorage.getItem('driverData');
      if (driverData) {
        JSON.parse(driverData);
        setIsLoggedIn(true);
        setShowIntro(false);
      }
    } catch {
      localStorage.removeItem('driverData');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleEnterApp = () => {
    setShowIntro(false);
  };

  const handleLogin = (data) => {
    localStorage.setItem('driverData', JSON.stringify(data));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('driverData');
    localStorage.removeItem('walletBalance');
    localStorage.removeItem('transactions');
    localStorage.removeItem('userStats');
    localStorage.removeItem('communityPosts');
    localStorage.removeItem('userPosts');
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app">
        {showIntro ? (
          <IntroPage onEnter={handleEnterApp} />
        ) : !isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <div className="shell">
            <aside className="sidebar">
              <div className="sidebar-brand">WheelWise</div>

              <nav className="sidebar-nav">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item${isActive ? ' active' : ''}`
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="sidebar-footer">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                  <span className="theme-label">
                    {theme === 'light' ? 'Dark mode' : 'Light mode'}
                  </span>
                </button>
              </div>
            </aside>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/post" element={<PostPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/account" element={<AccountPage onLogout={handleLogout} />} />
                <Route path="/chats" element={<ChatListPage />} />
                <Route path="*" element={<Navigate to="/feed" replace />} />
              </Routes>
            </main>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
