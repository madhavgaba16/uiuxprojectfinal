import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatsApi } from '../api';
import './ChatListPage.css';

const ChatListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allChats, setAllChats] = useState([]);
  const driverData = JSON.parse(localStorage.getItem('driverData') || '{}');
  
  useEffect(() => {
    const loadChats = async () => {
      if (!driverData._id) return;
      try {
        const data = await chatsApi.list(driverData._id);
        setAllChats(data.conversations || []);
      } catch (error) {
        alert(`Unable to load chats: ${error.message}`);
      }
    };

    loadChats();
  }, [driverData._id]);

  // Filter chats based on search query
  const filteredChats = allChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    // If searching, sort alphabetically by name
    if (searchQuery) {
      return a.name.localeCompare(b.name);
    }
    // Otherwise keep original order (most recent first)
    return 0;
  });

  const handleChatClick = (chat) => {
    localStorage.setItem('chatDriverName', chat.name);
    localStorage.setItem('selectedConversationId', chat.id);
    localStorage.setItem('openChat', 'true');
    navigate('/account');
  };

  const totalUnread = 0;

  return (
    <div className="chat-list-page">
      <div className="chat-list-container">
        {/* Header */}
        <div className="chat-list-header">
          <h2 className="chat-list-title">
            <span className="title-icon">💬</span>
            Messages
          </h2>
          {totalUnread > 0 && (
            <span className="total-unread-badge">{totalUnread}</span>
          )}
        </div>

        {/* Search Bar */}
        <div className="chat-search-container">
          <div className="chat-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search drivers by name or vehicle number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chat-search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="search-results-text">
              Found {filteredChats.length} result{filteredChats.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Chat List */}
        <div className="chats-container">
          {filteredChats.length === 0 ? (
            <div className="no-chats">
              <span className="no-chats-icon">😕</span>
              <p>No chats found</p>
              <p className="no-chats-subtitle">Try searching with a different name</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => handleChatClick(chat)}
              >
                <div className="chat-avatar">👤</div>
                <div className="chat-details">
                  <div className="chat-top">
                    <h3 className="chat-name">{chat.name}</h3>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <div className="chat-bottom">
                    <p className="chat-vehicle"> {chat.vehicleNumber}</p>
                    <p className="chat-last-message">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
