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

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
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

  const handleEnterApp = () => {
    setShowIntro(false);
  };

  const handleLogin = (data) => {
    // Assuming 'data' is the driver data to be stored on successful login
    localStorage.setItem('driverData', JSON.stringify(data)); 
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear all user-specific data from localStorage
    localStorage.removeItem('driverData');
    localStorage.removeItem('walletBalance');
    localStorage.removeItem('transactions');
    localStorage.removeItem('userStats');
    localStorage.removeItem('communityPosts');
    localStorage.removeItem('userPosts');
    sessionStorage.clear(); // Clear session storage (accepted rides)
    setIsLoggedIn(false);
  };

  const navItems = [
    { path: '/feed', label: 'Home', icon: '🏠' },
    { path: '/post', label: 'Post', icon: '📝' },
    { path: '/news', label: 'News', icon: '📰' },
    { path: '/services', label: 'Services', icon: '🛠' },
    { path: '/chats', label: 'Messages', icon: '💬' },
    { path: '/account', label: 'Profile', icon: '👤' }
  ];

  return (
    <Router>
      <div className="App">
        {showIntro ? (
          <IntroPage onEnter={handleEnterApp} />
        ) : !isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <div className="tw-shell">
            <aside className="tw-left">
              <div className="tw-brand">✦ DriverFeed</div>
              <nav className="tw-nav">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `tw-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="tw-nav-icon">{item.icon}</span>
                    <span className="tw-nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </aside>

            <main className="tw-main">
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

            <aside className="tw-right">
              <div className="tw-search">Search</div>
              <div className="tw-card">
                <h3>Driver Updates</h3>
                <p>#TrafficAlert</p>
                <p>#FuelPrices</p>
                <p>#RideTips</p>
                <p>#CityRoutes</p>
              </div>
              <div className="tw-card">
                <h3>Driver Channels</h3>
                <p>City Driver Union</p>
                <p>Safe Ride Network</p>
                <p>Patiala Traffic Desk</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;