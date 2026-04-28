import React, { useState, useEffect } from 'react';
import { chatsApi, walletApi } from '../api';
import './AccountPage.css';
const AccountPage = ({ onLogout }) => {

  const loggedInDriver = JSON.parse(localStorage.getItem('driverData') || '{}');
  
  const [userStats, setUserStats] = useState(() => {
    return JSON.parse(localStorage.getItem('userStats') || '{"trustScore": 95, "ridesShared": 127}');
  });
  
  const [showSOSFlash, setShowSOSFlash] = useState(false);
  const [flashColor, setFlashColor] = useState('red');
  
  const [showChat, setShowChat] = useState(false);
  const [driverName, setDriverName] = useState('Other Driver');
  const [confirmationStatus, setConfirmationStatus] = useState({
    driver: false,
    other: false
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    accountHolder: ''
  });
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadWalletData = async () => {
      if (!loggedInDriver._id) return;
      try {
        const data = await walletApi.get(loggedInDriver._id);
        setWalletBalance(data.balance || 0);
        setTransactions(data.transactions || []);
      } catch (error) {
        alert(`Unable to load wallet data: ${error.message}`);
      }
    };

    loadWalletData();
  }, [loggedInDriver._id]);

  useEffect(() => {
    setUserStats({
      trustScore: loggedInDriver.trustScore || 95,
      ridesShared: loggedInDriver.ridesShared || 127
    });
  }, [loggedInDriver.trustScore, loggedInDriver.ridesShared]);

  useEffect(() => {
    // Check if we should auto-open chat
    const shouldOpenChat = localStorage.getItem('openChat');
    const storedDriverName = localStorage.getItem('chatDriverName');
    const selectedChatId = localStorage.getItem('selectedConversationId');
    
    if (shouldOpenChat === 'true') {
      if (storedDriverName) {
        setDriverName(storedDriverName);
      }
      setShowChat(true);
      
      // Load previous chat messages if coming from chat list
      if (selectedChatId && loggedInDriver._id) {
        chatsApi
          .messages(selectedChatId)
          .then((data) => {
            const mapped = (data.messages || []).map((m) => ({
              id: m.id,
              type: m.senderId === loggedInDriver._id ? 'sent' : 'received',
              content: m.content,
              time: m.time
            }));
            setChatMessages(mapped);
          })
          .catch((error) => {
            alert(`Unable to load messages: ${error.message}`);
          });
      }
      
      // Clear the flags
      localStorage.removeItem('openChat');
      
      // Scroll to chat section
      setTimeout(() => {
        const chatSection = document.getElementById('chat');
        if (chatSection) {
          chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    const selectedChatId = localStorage.getItem('selectedConversationId');
    if (!selectedChatId || !loggedInDriver._id) return;

    try {
      const data = await chatsApi.sendMessage(selectedChatId, {
        senderId: loggedInDriver._id,
        content: chatInput.trim()
      });

      const newMessage = {
        id: data.message.id,
        type: 'sent',
        content: data.message.content,
        time: data.message.time
      };

      setChatMessages((prev) => [...prev, newMessage]);
      setChatInput('');
    } catch (error) {
      alert(`Unable to send message: ${error.message}`);
    }
  };

  const handleSubmitRating = () => {
    if (rating === 0) return;
    
    // Save rating and update trust score
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"trustScore": 95, "ridesShared": 127}');
    userStats.trustScore = Math.min(100, (userStats.trustScore || 95) + 0.3);
    localStorage.setItem('userStats', JSON.stringify(userStats));
    
    setShowRating(false);
    setRating(0);
    alert(`Thank you for rating ${driverName} with ${rating} stars! ⭐`);
  };

  const handleConfirmRide = (e) => {
    // Only confirm one party - the one who clicked
    setConfirmationStatus(prev => ({ ...prev, driver: true }));
    
    // Show commission popup immediately
    setTimeout(() => {
      showCommissionPopup();
      // Show rating modal after commission popup
      setTimeout(() => {
        setShowRating(true);
      }, 2000);
    }, 500);
  };

  const showCommissionPopup = async () => {
    const commissionAmount = 30;

    if (loggedInDriver._id) {
      try {
        const data = await walletApi.commission(loggedInDriver._id, {
          amount: commissionAmount,
          description: `Commission - Ride with ${driverName}`
        });
        setWalletBalance(data.balance || 0);
        setTransactions(data.transactions || []);
      } catch (error) {
        alert(`Unable to deduct commission: ${error.message}`);
      }
    }
    
    const popup = document.createElement('div');
    popup.className = 'commission-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-icon">💰</div>
        <h3>Commission Deducted</h3>
        <p class="deduction-amount">–₹${commissionAmount}</p>
        <p class="popup-message">Amount deducted from your wallet</p>
      </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.classList.add('show');
    }, 100);

    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 300);
    }, 3000);
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amountToAdd = parseFloat(amount);
    
    if (amountToAdd && amountToAdd > 0) {
      try {
        const data = await walletApi.add(loggedInDriver._id, amountToAdd);
        setWalletBalance(data.balance || 0);
        setTransactions(data.transactions || []);
        setAmount('');
        setShowAddMoney(false);
        alert(`✅ Successfully added ₹${amountToAdd} to your wallet!`);
      } catch (error) {
        alert(`Unable to add money: ${error.message}`);
      }
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amountToWithdraw = parseFloat(amount);
    
    if (amountToWithdraw && amountToWithdraw > 0) {
      if (amountToWithdraw <= walletBalance) {
        try {
          const data = await walletApi.withdraw(loggedInDriver._id, {
            amount: amountToWithdraw,
            accountNumber: bankDetails.accountNumber
          });

          setWalletBalance(data.balance || 0);
          setTransactions(data.transactions || []);
          setAmount('');
          setBankDetails({ accountNumber: '', ifsc: '', accountHolder: '' });
          setShowWithdraw(false);

          alert(`✅ Withdrawal request of ₹${amountToWithdraw} submitted!\nMoney will be transferred to your bank account within 2-3 business days.`);
        } catch (error) {
          alert(`Unable to withdraw: ${error.message}`);
        }
      } else {
        alert('❌ Insufficient balance!');
      }
    }
  };

  const handleSOS = () => {
    // Show flashing screen first
    console.log('SOS button clicked - starting flash');
    setShowSOSFlash(true);
    console.log('showSOSFlash set to true');
    
    // Toggle flash color every 2 seconds
    const flashInterval = setInterval(() => {
      setFlashColor(prev => prev === 'red' ? 'blue' : 'red');
    }, 2000);
    
    // Create and play siren sound using Web Audio API
    try {
      const audioContext =  window.webkitAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // // Set up siren sound
      // oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      
      // // Create siren effect - alternating frequency
      // let time = audioContext.currentTime;
      // for (let i = 0; i < 10; i++) {
      //   oscillator.frequency.linearRampToValueAtTime(800, time + 0.25);
      //   oscillator.frequency.linearRampToValueAtTime(400, time + 0.5);
      //   time += 0.5;
      // }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start();
      
      // Stop sound after 5 seconds
      setTimeout(() => {
        try {
          oscillator.stop();
          audioContext.close();
        } catch (e) {
          console.log('Audio cleanup error:', e);
        }
      }, 5000);
    } catch (error) {
      console.log('Audio error:', error);
    }
    
    // Stop flashing after 5 seconds and then show alert
    setTimeout(() => {
      console.log('Stopping flash');
      clearInterval(flashInterval);
      setShowSOSFlash(false);
      setFlashColor('red');
      alert('🚨 EMERGENCY SOS ACTIVATED!\n\n✅ Police have been notified\n✅ Nearby drivers alerted\n✅ Your location is being shared\n\nHelp is on the way!');
    }, 5000);
  };

  return (
    <>
      {/* SOS Flash Overlay - moved outside for better positioning */}
      {showSOSFlash && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            pointerEvents: 'none',
            backgroundColor: flashColor === 'red' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 0, 255, 0.9)',
            transition: 'background-color 0.1s ease'
          }}
        />
      )}
      
      <div className="account-page">
      {/* Profile Section */}
      <section className="profile-section" id="profile">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">👤</span>
            Driver Profile
          </h2>
        </div>

        <div className="profile-card">
          <div className="profile-banner">
            <div className="banner-gradient"></div>
            <button className="edit-profile-btn">
              <span>✏️</span>
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='100' fill='%233b82f6'/%3E%3Ctext x='100' y='130' font-size='80' fill='white' text-anchor='middle' font-family='Arial'%3E👤%3C/text%3E%3C/svg%3E" alt="Driver Avatar" />
                <div className="verification-badge">✓</div>
              </div>
              <div className="community-badge">
                <span className="badge-icon">🏆</span>
                <span>Patiala Community</span>
              </div>
            </div>

            <div className="profile-details">
              <h3 className="driver-name">{loggedInDriver.name || 'Driver Name'}</h3>
              <p className="vehicle-number">🚗 {loggedInDriver.vehicleNumber || 'PB11-XX-XXXX'}</p>
              
              <div className="profile-stats">
                <div className="stat-box">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <span className="stat-value">4.8</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🛡️</div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats.trustScore?.toFixed(1) || '95.0'}%</span>
                    <span className="stat-label">Trust Score</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🚙</div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats.ridesShared || 127}</span>
                    <span className="stat-label">Rides Shared</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-info">
                    <span className="stat-value">43</span>
                    <span className="stat-label">Alerts Posted</span>
                  </div>
                </div>
              </div>

              <div className="vehicle-info">
                <h4>Vehicle Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Car Model</span>
                    <span className="info-value">{loggedInDriver.carModel || 'Maruti Swift'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">License Number</span>
                    <span className="info-value">{loggedInDriver.licenseNumber || 'DL-XXXXXXXXXX'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{loggedInDriver.phone || '+91 XXXXX XXXXX'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">License Status</span>
                    <span className="info-value verified">✓ Verified</span>
                  </div>
                </div>
                <div className="car-photo">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%231a1a2e'/%3E%3Ctext x='200' y='125' font-size='60' fill='%2394a3b8' text-anchor='middle' font-family='Arial'%3E🚗%3C/text%3E%3C/svg%3E" alt="Car" />
                </div>
              </div>
              
              <button className="logout-btn" onClick={onLogout}>
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Section */}
      <section className="wallet-section" id="wallet">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">💰</span>
            Wallet
          </h2>
        </div>

        <div className="wallet-card">
          <div className="wallet-balance">
            <div className="balance-display">
              <span className="balance-label">Total Balance</span>
              <span className="balance-amount">₹{walletBalance.toFixed(2)}</span>
            </div>
            <div className="balance-actions">
              <button className="wallet-action-btn add" onClick={() => setShowAddMoney(true)}>
                <span>➕</span>
                <span>Add Money</span>
              </button>
              <button className="wallet-action-btn withdraw" onClick={() => setShowWithdraw(true)}>
                <span>💸</span>
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          <div className="wallet-stats-grid">
            <div className="wallet-stat">
              <div className="stat-icon-box earnings">💵</div>
              <div className="stat-content">
                <span className="stat-amount">₹3,240</span>
                <span className="stat-name">Commission Earned</span>
              </div>
            </div>
            <div className="wallet-stat">
              <div className="stat-icon-box deductions">📉</div>
              <div className="stat-content">
                <span className="stat-amount">₹790</span>
                <span className="stat-name">Deductions</span>
              </div>
            </div>
            <div className="wallet-stat">
              <div className="stat-icon-box cashback">🎁</div>
              <div className="stat-content">
                <span className="stat-amount">₹125</span>
                <span className="stat-name">Cashback & Bonus</span>
              </div>
            </div>
          </div>

          <div className="transaction-section">
            <div className="transaction-header">
              <h3>Transaction History</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="transactions-list">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === 'credit' ? '💰' : '💸'}
                  </div>
                  <div className="transaction-info">
                    <span className="transaction-title">{transaction.description}</span>
                    <span className="transaction-date">{transaction.date} • {transaction.time}</span>
                  </div>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '–'}₹{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="chat-section" id="chat">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">💬</span>
            Ride Chat
          </h2>
        </div>

        <div className="chat-card">
          <div className="chat-info-banner">
            <div className="info-icon-large">ℹ️</div>
            <div className="info-text">
              <h4>Automated Chat Opening</h4>
              <p>Chat opens automatically when you accept a shared ride request</p>
            </div>
          </div>

          {!showChat ? (
            <div className="chat-demo-section">
              <p className="demo-hint" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                💬 Chat will open automatically when you accept a ride request or click Messages from chat list
              </p>
            </div>
          ) : (
            <div className="chat-interface">
              <div className="chat-header-bar">
                <div className="chat-user-info">
                  <div className="chat-avatar">👤</div>
                  <div>
                    <h4>{driverName}</h4>
                    <span className="online-status">● Online</span>
                  </div>
                </div>
                <button className="close-chat-btn" onClick={() => setShowChat(false)}>✕</button>
              </div>

              <div className="chat-messages">
                {chatMessages.length === 0 ? (
                  <div className="empty-chat">
                    <span className="empty-icon">💬</span>
                    <p>Start a conversation with {driverName}</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                      {msg.type === 'received' && (
                        <div className="message-header-inline">
                          <strong>{driverName}</strong>
                        </div>
                      )}
                      <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="ride-confirmation-section">
                <div className="confirmation-banner">
                  <span className="confirm-icon">🤝</span>
                  <p>Confirm to finalize the ride booking</p>
                </div>
                <div className="confirmation-buttons">
                  <button 
                    className={`confirm-btn ${confirmationStatus.driver ? 'confirmed' : ''}`}
                    onClick={handleConfirmRide}
                    disabled={confirmationStatus.driver}
                  >
                    {confirmationStatus.driver ? '✓ Ride Confirmed' : 'Confirm Ride'}
                  </button>
                </div>
                {confirmationStatus.driver && (
                  <div className="confirmation-success">
                    <span className="success-icon">✓</span>
                    <p>Ride confirmed successfully! Commission will be deducted from wallet.</p>
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  <span>📤</span>
                </button>
                <button className="voice-btn" title="Voice Note">
                  <span>🎤</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Rating Modal */}
      {showRating && (
        <div className="modal-overlay" onClick={() => setShowRating(false)}>
          <div className="modal-content rating-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRating(false)}>×</button>
            <h3 className="modal-title">Rate Your Experience</h3>
            <p className="rating-subtitle">How was your ride with {driverName}?</p>
            
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="rating-text">
              {rating === 0 ? 'Select a rating' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent!'}
            </p>
            
            <button 
              className="submit-rating-btn"
              onClick={handleSubmitRating}
              disabled={rating === 0}
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}

      {/* SOS Section */}
      <section className="sos-section" id="sos">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🆘</span>
            Emergency SOS
          </h2>
        </div>

        <div className="sos-card">
          <div className="sos-warning">
            <div className="warning-icon">⚠️</div>
            <h3>Emergency Features</h3>
            <p>Use these features only in case of real emergency</p>
          </div>

          <div className="sos-main-button">
            <button className="sos-trigger-btn" onClick={handleSOS}>
              <span className="sos-icon">🆘</span>
              <span className="sos-text">PRESS FOR EMERGENCY</span>
            </button>
            <p className="sos-description">
              Broadcasts SOS to nearby drivers, alerts nearest police station, and shares your live location
            </p>
          </div>

          <div className="sos-features">
            <h4>When you press SOS:</h4>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📡</div>
                <h5>Broadcast Alert</h5>
                <p>Notify all nearby drivers</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚔</div>
                <h5>Police Alert</h5>
                <p>Notify nearest police station</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📍</div>
                <h5>Live Location</h5>
                <p>Share real-time location</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h5>Voice Note</h5>
                <p>Optional voice message</p>
              </div>
            </div>
          </div>

          <div className="quick-contact-buttons">
            <h4>Quick Contact</h4>
            <div className="contact-buttons-grid">
              <button className="emergency-contact-btn police">
                <span className="contact-icon">🚔</span>
                <div className="contact-info">
                  <span className="contact-label">Call Police</span>
                  <span className="contact-number">100</span>
                </div>
              </button>
              <button className="emergency-contact-btn driver">
                <span className="contact-icon">🚗</span>
                <div className="contact-info">
                  <span className="contact-label">Call Nearby Driver</span>
                  <span className="contact-number">Community</span>
                </div>
              </button>
              <button className="emergency-contact-btn ambulance">
                <span className="contact-icon">🚑</span>
                <div className="contact-info">
                  <span className="contact-label">Call Ambulance</span>
                  <span className="contact-number">102</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="modal-overlay" onClick={() => setShowAddMoney(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2> Add Money to Wallet</h2>
              <button className="modal-close" onClick={() => setShowAddMoney(false)}>✕</button>
            </div>
            <form onSubmit={handleAddMoney}>
              <div className="form-group" style="color :black;">
                <label>Enter Amount</label>
                <input
                  type="number"
                  placeholder="₹ Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                  className="money-input"
                />
              </div>
              <div className="quick-amounts">
                <button type="button" onClick={() => setAmount('500')} className="quick-amt-btn">₹500</button>
                <button type="button" onClick={() => setAmount('1000')} className="quick-amt-btn">₹1000</button>
                <button type="button" onClick={() => setAmount('2000')} className="quick-amt-btn">₹2000</button>
                <button type="button" onClick={() => setAmount('5000')} className="quick-amt-btn">₹5000</button>
              </div>
              <div className="payment-methods">
                <h4>Payment Method</h4>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <span>💳 UPI</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>🏦 Net Banking</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>💳 Debit Card</span>
                  </label>
                </div>
              </div>
              <button type="submit" className="submit-btn">Add Money</button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Money Modal */}
      {showWithdraw && (
        <div className="modal-overlay" onClick={() => setShowWithdraw(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💸 Withdraw Money</h2>
              <button className="modal-close" onClick={() => setShowWithdraw(false)}>✕</button>
            </div>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label>Withdrawal Amount</label>
                <input
                  type="number"
                  placeholder="₹ Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={walletBalance}
                  required
                  className="money-input"
                />
                <small>Available Balance: ₹{walletBalance.toFixed(2)}</small>
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  required
                  className="money-input"
                />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifsc}
                  onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})}
                  required
                  className="money-input"
                />
              </div>
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Enter account holder name"
                  value={bankDetails.accountHolder}
                  onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                  required
                  className="money-input"
                />
              </div>
              <button type="submit" className="submit-btn withdraw-btn">Withdraw Money</button>
              <p className="withdrawal-note">💡 Money will be transferred within 2-3 business days</p>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AccountPage;
