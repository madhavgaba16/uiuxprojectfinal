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
    <div className="page-container chatlist-page">
      {/* Header */}
      <div className="page-header chatlist-header">
        <h2 className="page-title">Messages</h2>
        {totalUnread > 0 && (
          <span className="badge badge-danger">{totalUnread}</span>
        )}
      </div>

      {/* Search Bar */}
      <div className="chatlist-search">
        <div className="chatlist-search-box">
          <input
            type="text"
            placeholder="Search by name or vehicle number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
          {searchQuery && (
            <button
              className="chatlist-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              x
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="chatlist-results-text">
            Found {filteredChats.length} result{filteredChats.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Chat List */}
      <div className="chatlist-items">
        {filteredChats.length === 0 ? (
          <div className="chatlist-empty">
            <p className="chatlist-empty-title">No chats found</p>
            <p className="chatlist-empty-subtitle">Try searching with a different name</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="chatlist-item card"
              onClick={() => handleChatClick(chat)}
            >
              <div className="avatar-circle">
                {chat.name ? chat.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="chatlist-item-body">
                <div className="chatlist-item-top">
                  <h3 className="chatlist-item-name">{chat.name}</h3>
                  <span className="chatlist-item-time">{chat.time}</span>
                </div>
                <div className="chatlist-item-bottom">
                  <p className="chatlist-item-vehicle">{chat.vehicleNumber}</p>
                  <p className="chatlist-item-message">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
