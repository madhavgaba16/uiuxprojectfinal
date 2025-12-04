import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './components/IntroPage';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import PostPage from './components/PostPage';
import NewsPage from './components/NewsPage';
import ServicesPage from './components/ServicesPage';
import AccountPage from './components/AccountPage';
import ChatListPage from './components/ChatListPage';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const driverData = localStorage.getItem('driverData');
    
    if (driverData) {
      setIsLoggedIn(true);
      setShowIntro(false);
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

  return ( // <-- **The main return was incorrectly started and duplicated!**
    <Router>
      <div className="App">
        {showIntro ? (
          <IntroPage onEnter={handleEnterApp} />
        ) : !isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            <Routes>
              {/* Redirect root to feed when logged in */}
              <Route path="/" element={<Navigate to="/feed" replace />} /> 
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/post" element={<PostPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/account" element={<AccountPage onLogout={handleLogout} />} />
              <Route path="/chats" element={<ChatListPage />} />
              {/* Catch-all route to redirect to feed */}
              <Route path="*" element={<Navigate to="/feed" replace />} /> 
            </Routes>
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;