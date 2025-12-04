import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'feed', label: 'Feed', icon: '📱', path: '/feed' },
    { id: 'post', label: 'Post', icon: '➕', path: '/post' },
    { id: 'news', label: 'News', icon: '📰', path: '/news' },
    { id: 'services', label: 'Services', icon: '🛠️', path: '/services' },
    { id: 'account', label: 'Account', icon: '👤', path: '/account' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {isActive(item.path) && <span className="active-indicator"></span>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
