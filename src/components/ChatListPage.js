import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatListPage.css';

const ChatListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get all chats from localStorage
  const [allChats, setAllChats] = useState(() => {
    const stored = localStorage.getItem('allChats');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize default chats
    const defaultChats = [
      { id: 1, name: 'Sameer Khan ', vehicleNumber: 'PB11-CH-4521', lastMessage: 'Huni aya pajji ', time: '2 hours ago', unread: 0, avatar: '👨' },
      { id: 2, name: 'Priya Singh', vehicleNumber: 'PB11-DK-8765', lastMessage: 'Traffic cleared now', time: '4 hours ago', unread: 2, avatar: '👩' },
      { id: 3, name: 'Amarjeet Brar', vehicleNumber: 'PB11-AB-3210', lastMessage: 'Drive safe in the rain', time: '6 hours ago', unread: 0, avatar: '👨' },
      { id: 4, name: 'Gurpreet Dhillon', vehicleNumber: 'PB11-GS-7732', lastMessage: 'Monthly rate confirmed', time: '8 hours ago', unread: 1, avatar: '👨' },
      { id: 5, name: 'Harpreet Kaur', vehicleNumber: 'PB11-HK-5544', lastMessage: 'Road work updates', time: '10 hours ago', unread: 0, avatar: '👩' },
      { id: 6, name: 'Sukhwinder Sandhu', vehicleNumber: 'PB11-SS-9988', lastMessage: 'Kasauli trip sounds good', time: '12 hours ago', unread: 3, avatar: '👨' },
      { id: 7, name: 'Manpreet Singh', vehicleNumber: 'PB11-MS-1122', lastMessage: 'What time pickup?', time: '1 day ago', unread: 0, avatar: '👨' },
      { id: 8, name: 'Simran Kaur', vehicleNumber: 'PB11-SK-3344', lastMessage: 'Thanks for the ride!', time: '1 day ago', unread: 0, avatar: '👩' },
      { id: 9, name: 'Karan Verma', vehicleNumber: 'PB11-KV-5566', lastMessage: 'Payment sent ✓', time: '2 days ago', unread: 0, avatar: '👨' },
      { id: 10, name: 'Anjali Sharma', vehicleNumber: 'PB11-AS-7788', lastMessage: 'Can we share ride tomorrow?', time: '2 days ago', unread: 1, avatar: '👩' }
    ];
    
    // Initialize chat histories for each chat
    const chatHistories = {
      1: [
        { id: 1, type: 'received', content: 'ਸਸ੍ਰੀ ਆਕਾਲ ਜੀ! Tomorrow Chandigarh chaliye?<br/>Sasri Akal ji! Tomorrow Chandigarh chaliye?', time: '2 hours ago' },
        { id: 2, type: 'sent', content: 'Yes, 8 AM sharp. Bus Stand?', time: '2 hours ago' },
        { id: 3, type: 'received', content: 'ਹਾਂ ਜੀ! Thanks! See you tomorrow 🚗<br/>Haan ji! Thanks! See you tomorrow', time: '2 hours ago' }
      ],
      2: [
        { id: 1, type: 'sent', content: 'Heavy traffic near Railway Station?', time: '5 hours ago' },
        { id: 2, type: 'received', content: 'ਹਾਂ ਜੀ, ਬਹੁਤ ਭੀੜ ਆ। VIP movement ਚੱਲ ਰਹੀ ਆ<br/>Haan ji, bahut bheed aa. VIP movement chal rahi aa', time: '5 hours ago' },
        { id: 3, type: 'sent', content: 'Still there?', time: '4 hours ago' },
        { id: 4, type: 'received', content: 'ਨਹੀਂ, ਹੁਣ ਸਾਫ ਹੋ ਗਈ। Traffic cleared now 👍<br/>Nahi, hun saaf ho gayi. Traffic cleared now', time: '4 hours ago' }
      ],
      3: [
        { id: 1, type: 'received', content: 'ਮੀਂਹ ਦੀ ਚੇਤਾਵਨੀ ਆ ਗਈ! Rain expected ☔<br/>Meeh di chetavani aa gayi! Rain expected', time: '7 hours ago' },
        { id: 2, type: 'sent', content: 'What time?', time: '6 hours ago' },
        { id: 3, type: 'received', content: 'ਸ਼ਾਮ 5-8 PM ਦੌਰਾਨ। Drive safe in the rain 🌧️<br/>Shaam 5-8 PM dauran. Drive safe in the rain', time: '6 hours ago' }
      ],
      4: [
        { id: 1, type: 'sent', content: 'Monthly rate kina hoyega?', time: '9 hours ago' },
        { id: 2, type: 'received', content: 'ਮੰਥਲੀ 2500-3000 ਹੋਵੇਗਾ<br/>Monthly 2500-3000 hovega', time: '8 hours ago' },
        { id: 3, type: 'sent', content: 'Perfect!', time: '8 hours ago' },
        { id: 4, type: 'received', content: 'ਠੀਕ ਆ! Monthly rate confirmed ✓<br/>Thik aa! Monthly rate confirmed', time: '8 hours ago' }
      ],
      5: [
        { id: 1, type: 'received', content: 'ਸਿਵਲ ਲਾਈਨ ਤੇ ਸੜਕ ਦੀ ਮੁਰੰਮਤ ਚੱਲ ਰਹੀ<br/>Civil Line te sadak di murammat chal rahi', time: '11 hours ago' },
        { id: 2, type: 'sent', content: 'How long?', time: '10 hours ago' },
        { id: 3, type: 'received', content: 'ਅਗਲੇ 3 ਦਿਨ। Road work updates 🚧<br/>Agle 3 din. Road work updates', time: '10 hours ago' }
      ],
      6: [
        { id: 1, type: 'sent', content: 'Kasauli trip plan?', time: '13 hours ago' },
        { id: 2, type: 'received', content: 'ਹਾਂ, ਵੀਕੈਂਡ ਤੇ। 4 ਸੀਟਾਂ ਖਾਲੀ<br/>Haan, weekend te. 4 seats khali', time: '12 hours ago' },
        { id: 3, type: 'sent', content: 'Kasauli trip sounds good!', time: '12 hours ago' }
      ],
      7: [
        { id: 1, type: 'received', content: 'ਕੱਲ੍ਹ ਪਿਕਅੱਪ ਦਾ ਸਮਾਂ?<br/>Kal pickup da samaa?', time: '1 day ago' },
        { id: 2, type: 'sent', content: 'What time pickup?', time: '1 day ago' }
      ],
      8: [
        { id: 1, type: 'received', content: 'ਰਾਈਡ ਲਈ ਧੰਨਵਾਦ! Very comfortable 🚗<br/>Ride layi dhannvaad! Very comfortable', time: '1 day ago' },
        { id: 2, type: 'sent', content: 'Thanks for the ride!', time: '1 day ago' }
      ],
      9: [
        { id: 1, type: 'sent', content: 'Payment kardi aa', time: '2 days ago' },
        { id: 2, type: 'received', content: 'ਧੰਨਵਾਦ! Payment sent ✓<br/>Dhannvaad! Payment sent', time: '2 days ago' }
      ],
      10: [
        { id: 1, type: 'received', content: 'ਕੱਲ੍ਹ ਰਾਈਡ ਸ਼ੇਅਰ ਕਰ ਸਕਦੇ?<br/>Kal ride share kar sakde?', time: '2 days ago' },
        { id: 2, type: 'sent', content: 'Can we share ride tomorrow?', time: '2 days ago' }
      ]
    };
    
    // Save chat histories to localStorage
    Object.keys(chatHistories).forEach(chatId => {
      const key = `chat_${chatId}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(chatHistories[chatId]));
      }
    });
    
    return defaultChats;
  });

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
    // Save selected chat driver name for AccountPage
    localStorage.setItem('chatDriverName', chat.name);
    localStorage.setItem('selectedChatId', chat.id);
    localStorage.setItem('openChat', 'true');
    
    // Navigate to account page with chat open
    navigate('/account');
  };

  const totalUnread = allChats.reduce((sum, chat) => sum + chat.unread, 0);

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
                className={`chat-item ${chat.unread > 0 ? 'unread' : ''}`}
                onClick={() => handleChatClick(chat)}
              >
                <div className="chat-avatar">{chat.avatar}</div>
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
                {chat.unread > 0 && (
                  <span className="unread-badge">{chat.unread}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
