import React, { useState, useEffect } from 'react';
import { chatsApi, walletApi } from '../api';
import './AccountPage.css';

const AccountPage = ({ onLogout }) => {
  const loggedInDriver = JSON.parse(localStorage.getItem('driverData') || '{}');

  const [userStats, setUserStats] = useState(() => {
    return JSON.parse(localStorage.getItem('userStats') || '{"trustScore": 95, "ridesShared": 127}');
  });

  const [showSOSFlash, setShowSOSFlash] = useState(false);

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
    const stats = JSON.parse(localStorage.getItem('userStats') || '{"trustScore": 95, "ridesShared": 127}');
    stats.trustScore = Math.min(100, (stats.trustScore || 95) + 0.3);
    localStorage.setItem('userStats', JSON.stringify(stats));

    setShowRating(false);
    setRating(0);
    alert(`Thank you for rating ${driverName} with ${rating} stars!`);
  };

  const handleConfirmRide = () => {
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

    // Build popup using safe DOM methods (no innerHTML)
    const popup = document.createElement('div');
    popup.className = 'commission-popup';

    const content = document.createElement('div');
    content.className = 'popup-content';

    const label = document.createElement('p');
    label.className = 'popup-label';
    label.textContent = 'Commission Deducted';

    const amountEl = document.createElement('p');
    amountEl.className = 'deduction-amount';
    amountEl.textContent = '–₹' + commissionAmount;

    const msg = document.createElement('p');
    msg.className = 'popup-message';
    msg.textContent = 'Amount deducted from your wallet';

    content.appendChild(label);
    content.appendChild(amountEl);
    content.appendChild(msg);
    popup.appendChild(content);
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
        alert(`Successfully added Rs.${amountToAdd} to your wallet!`);
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

          alert(`Withdrawal request of Rs.${amountToWithdraw} submitted!\nMoney will be transferred to your bank account within 2-3 business days.`);
        } catch (error) {
          alert(`Unable to withdraw: ${error.message}`);
        }
      } else {
        alert('Insufficient balance!');
      }
    }
  };

  const handleSOS = () => {
    setShowSOSFlash(true);

    // Stop flashing after 5 seconds and then show alert
    setTimeout(() => {
      setShowSOSFlash(false);
      alert('EMERGENCY SOS ACTIVATED!\n\nPolice have been notified\nNearby drivers alerted\nYour location is being shared\n\nHelp is on the way!');
    }, 5000);
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <>
      {/* SOS Flash Overlay */}
      {showSOSFlash && <div className="acct-sos-flash" />}

      <div className="page-container acct-page">
        {/* ── Profile Section ────────────────────────────── */}
        <section id="profile">
          <div className="page-header">
            <h2 className="page-title">Driver Profile</h2>
          </div>

          <div className="card acct-profile-card">
            <div className="acct-profile-top">
              <div className="avatar-circle acct-profile-avatar">
                {(loggedInDriver.name || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="acct-driver-name">{loggedInDriver.name || 'Driver Name'}</h3>
                <p className="acct-vehicle-number">{loggedInDriver.vehicleNumber || 'PB11-XX-XXXX'}</p>
              </div>
            </div>

            <div className="acct-stats-grid">
              <div className="acct-stat-box">
                <span className="acct-stat-value">4.8</span>
                <span className="acct-stat-label">Rating</span>
              </div>
              <div className="acct-stat-box">
                <span className="acct-stat-value">{userStats.trustScore?.toFixed(1) || '95.0'}%</span>
                <span className="acct-stat-label">Trust Score</span>
              </div>
              <div className="acct-stat-box">
                <span className="acct-stat-value">{userStats.ridesShared || 127}</span>
                <span className="acct-stat-label">Rides Shared</span>
              </div>
              <div className="acct-stat-box">
                <span className="acct-stat-value">43</span>
                <span className="acct-stat-label">Alerts Posted</span>
              </div>
            </div>

            <div className="acct-vehicle-info">
              <h4 className="acct-section-label">Vehicle Information</h4>
              <div className="acct-info-grid">
                <div className="acct-info-item">
                  <span className="acct-info-label">Car Model</span>
                  <span className="acct-info-value">{loggedInDriver.carModel || 'Maruti Swift'}</span>
                </div>
                <div className="acct-info-item">
                  <span className="acct-info-label">License Number</span>
                  <span className="acct-info-value">{loggedInDriver.licenseNumber || 'DL-XXXXXXXXXX'}</span>
                </div>
                <div className="acct-info-item">
                  <span className="acct-info-label">Phone Number</span>
                  <span className="acct-info-value">{loggedInDriver.phone || '+91 XXXXX XXXXX'}</span>
                </div>
                <div className="acct-info-item">
                  <span className="acct-info-label">License Status</span>
                  <span className="acct-info-value acct-verified">Verified</span>
                </div>
              </div>
            </div>

            <button className="btn-danger acct-logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </section>

        {/* ── Wallet Section ─────────────────────────────── */}
        <section id="wallet">
          <div className="page-header">
            <h2 className="page-title">Wallet</h2>
          </div>

          <div className="card acct-wallet-card">
            <div className="acct-wallet-balance">
              <div>
                <span className="acct-balance-label">Total Balance</span>
                <span className="acct-balance-amount">Rs.{walletBalance.toFixed(2)}</span>
              </div>
              <div className="acct-balance-actions">
                <button className="btn-primary" onClick={() => setShowAddMoney(true)}>Add Money</button>
                <button className="btn-secondary" onClick={() => setShowWithdraw(true)}>Withdraw</button>
              </div>
            </div>

            <div className="acct-wallet-stats">
              <div className="acct-wallet-stat">
                <span className="acct-wstat-amount">Rs.3,240</span>
                <span className="acct-wstat-label">Commission Earned</span>
              </div>
              <div className="acct-wallet-stat">
                <span className="acct-wstat-amount acct-wstat-deduction">Rs.790</span>
                <span className="acct-wstat-label">Deductions</span>
              </div>
              <div className="acct-wallet-stat">
                <span className="acct-wstat-amount acct-wstat-bonus">Rs.125</span>
                <span className="acct-wstat-label">Cashback and Bonus</span>
              </div>
            </div>

            <div className="acct-transactions">
              <div className="acct-transactions-header">
                <h4 className="acct-section-label">Transaction History</h4>
                <button className="btn-secondary acct-view-all-btn">View All</button>
              </div>
              <div className="acct-transactions-list">
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="acct-txn-item">
                    <div className={`acct-txn-indicator ${transaction.type}`} />
                    <div className="acct-txn-info">
                      <span className="acct-txn-title">{transaction.description}</span>
                      <span className="acct-txn-date">{transaction.date} - {transaction.time}</span>
                    </div>
                    <span className={`acct-txn-amount ${transaction.type}`}>
                      {transaction.type === 'credit' ? '+' : '-'}Rs.{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Chat Section ───────────────────────────────── */}
        <section id="chat">
          <div className="page-header">
            <h2 className="page-title">Ride Chat</h2>
          </div>

          <div className="card acct-chat-card">
            <div className="acct-chat-banner">
              <div>
                <h4 className="acct-chat-banner-title">Automated Chat Opening</h4>
                <p className="acct-chat-banner-text">Chat opens automatically when you accept a shared ride request</p>
              </div>
            </div>

            {!showChat ? (
              <div className="acct-chat-placeholder">
                <p>Chat will open automatically when you accept a ride request or click Messages from chat list</p>
              </div>
            ) : (
              <div className="acct-chat-interface">
                <div className="acct-chat-header">
                  <div className="acct-chat-user">
                    <div className="avatar-circle">
                      {driverName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="acct-chat-username">{driverName}</h4>
                      <span className="acct-chat-status">Online</span>
                    </div>
                  </div>
                  <button className="modal-close" onClick={() => setShowChat(false)}>x</button>
                </div>

                <div className="acct-chat-messages">
                  {chatMessages.length === 0 ? (
                    <div className="acct-chat-empty">
                      <p>Start a conversation with {driverName}</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className={`acct-msg ${msg.type}`}>
                        {msg.type === 'received' && (
                          <div className="acct-msg-sender">
                            <strong>{driverName}</strong>
                          </div>
                        )}
                        <p className="acct-msg-content">{msg.content}</p>
                        <span className="acct-msg-time">{msg.time}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="acct-ride-confirm">
                  <p className="acct-ride-confirm-text">Confirm to finalize the ride booking</p>
                  <div className="acct-ride-confirm-actions">
                    <button
                      className={`btn-primary acct-confirm-btn ${confirmationStatus.driver ? 'confirmed' : ''}`}
                      onClick={handleConfirmRide}
                      disabled={confirmationStatus.driver}
                    >
                      {confirmationStatus.driver ? 'Ride Confirmed' : 'Confirm Ride'}
                    </button>
                  </div>
                  {confirmationStatus.driver && (
                    <div className="acct-confirm-success">
                      <p>Ride confirmed successfully! Commission will be deducted from wallet.</p>
                    </div>
                  )}
                </div>

                <div className="acct-chat-input-area">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="input-field"
                  />
                  <button className="btn-primary" onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Rating Modal ───────────────────────────────── */}
        {showRating && (
          <div className="modal-overlay" onClick={() => setShowRating(false)}>
            <div className="modal-content acct-rating-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowRating(false)}>x</button>
              <h3 className="acct-rating-title">Rate Your Experience</h3>
              <p className="acct-rating-subtitle">How was your ride with {driverName}?</p>

              <div className="acct-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`acct-star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {star}
                  </button>
                ))}
              </div>
              <p className="acct-rating-text">
                {rating === 0 ? 'Select a rating' : ratingLabels[rating]}
              </p>

              <button
                className="btn-primary acct-submit-rating"
                onClick={handleSubmitRating}
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        )}

        {/* ── SOS Section ────────────────────────────────── */}
        <section id="sos">
          <div className="page-header">
            <h2 className="page-title">Emergency SOS</h2>
          </div>

          <div className="card acct-sos-card">
            <div className="acct-sos-warning">
              <h4>Emergency Features</h4>
              <p>Use these features only in case of real emergency</p>
            </div>

            <div className="acct-sos-main">
              <button className="acct-sos-trigger" onClick={handleSOS}>
                <span className="acct-sos-label">SOS</span>
                <span className="acct-sos-sublabel">PRESS FOR EMERGENCY</span>
              </button>
              <p className="acct-sos-desc">
                Broadcasts SOS to nearby drivers, alerts nearest police station, and shares your live location
              </p>
            </div>

            <div className="acct-sos-features">
              <h4 className="acct-section-label">When you press SOS:</h4>
              <div className="acct-features-grid">
                <div className="acct-feature-card">
                  <h5>Broadcast Alert</h5>
                  <p>Notify all nearby drivers</p>
                </div>
                <div className="acct-feature-card">
                  <h5>Police Alert</h5>
                  <p>Notify nearest police station</p>
                </div>
                <div className="acct-feature-card">
                  <h5>Live Location</h5>
                  <p>Share real-time location</p>
                </div>
                <div className="acct-feature-card">
                  <h5>Voice Note</h5>
                  <p>Optional voice message</p>
                </div>
              </div>
            </div>

            <div className="acct-quick-contacts">
              <h4 className="acct-section-label">Quick Contact</h4>
              <div className="acct-contacts-grid">
                <button className="acct-contact-btn">
                  <div className="acct-contact-info">
                    <span className="acct-contact-label">Call Police</span>
                    <span className="acct-contact-number">100</span>
                  </div>
                </button>
                <button className="acct-contact-btn">
                  <div className="acct-contact-info">
                    <span className="acct-contact-label">Call Nearby Driver</span>
                    <span className="acct-contact-number">Community</span>
                  </div>
                </button>
                <button className="acct-contact-btn">
                  <div className="acct-contact-info">
                    <span className="acct-contact-label">Call Ambulance</span>
                    <span className="acct-contact-number">102</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Add Money Modal ────────────────────────────── */}
        {showAddMoney && (
          <div className="modal-overlay" onClick={() => setShowAddMoney(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowAddMoney(false)}>x</button>
              <h3 className="acct-modal-title">Add Money to Wallet</h3>
              <form onSubmit={handleAddMoney}>
                <div className="acct-form-group">
                  <label className="form-label">Enter Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    required
                    className="input-field"
                  />
                </div>
                <div className="acct-quick-amounts">
                  <button type="button" onClick={() => setAmount('500')} className="btn-secondary">500</button>
                  <button type="button" onClick={() => setAmount('1000')} className="btn-secondary">1000</button>
                  <button type="button" onClick={() => setAmount('2000')} className="btn-secondary">2000</button>
                  <button type="button" onClick={() => setAmount('5000')} className="btn-secondary">5000</button>
                </div>
                <div className="acct-form-group">
                  <label className="form-label">Payment Method</label>
                  <div className="acct-payment-options">
                    <label className="acct-payment-option">
                      <input type="radio" name="payment" defaultChecked />
                      <span>UPI</span>
                    </label>
                    <label className="acct-payment-option">
                      <input type="radio" name="payment" />
                      <span>Net Banking</span>
                    </label>
                    <label className="acct-payment-option">
                      <input type="radio" name="payment" />
                      <span>Debit Card</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn-primary acct-modal-submit">Add Money</button>
              </form>
            </div>
          </div>
        )}

        {/* ── Withdraw Money Modal ───────────────────────── */}
        {showWithdraw && (
          <div className="modal-overlay" onClick={() => setShowWithdraw(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowWithdraw(false)}>x</button>
              <h3 className="acct-modal-title">Withdraw Money</h3>
              <form onSubmit={handleWithdraw}>
                <div className="acct-form-group">
                  <label className="form-label">Withdrawal Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max={walletBalance}
                    required
                    className="input-field"
                  />
                  <span className="form-hint">Available Balance: Rs.{walletBalance.toFixed(2)}</span>
                </div>
                <div className="acct-form-group">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
                <div className="acct-form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="Enter IFSC code"
                    value={bankDetails.ifsc}
                    onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
                <div className="acct-form-group">
                  <label className="form-label">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary acct-modal-submit">Withdraw Money</button>
                <p className="form-hint" style={{ textAlign: 'center', marginTop: '8px' }}>
                  Money will be transferred within 2-3 business days
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountPage;
