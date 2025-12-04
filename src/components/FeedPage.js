import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedPage.css';

const FeedPage = () => {
  const navigate = useNavigate();

  // Get logged-in driver data
  const driverData = JSON.parse(localStorage.getItem('driverData') || '{}');
  
  // Get user posts from localStorage
  const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');

  // Track accepted rides in session storage (clears on logout)
  const [acceptedRides, setAcceptedRides] = useState(() => {
    const sessionAccepted = sessionStorage.getItem('acceptedRides');
    return sessionAccepted ? JSON.parse(sessionAccepted) : [];
  });

  // Initialize community posts with upvotes/downvotes
  const [communityPosts, setCommunityPosts] = useState(() => {
    // Temporarily clear localStorage to reset posts - remove this line after first load
    localStorage.removeItem('communityPosts');
    
    const stored = localStorage.getItem('communityPosts');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      { id: 'cp1', authorName: 'Sameer Khan', vehicleNumber: 'PB11-CH-4521', trustScore: 97.5, category: 'ride', title: 'Going to Chandigarh - 3 Seats Available', description: 'Leaving tomorrow morning at 8 AM. Looking for passengers to share fuel costs. AC car, comfortable ride. Contact me if interested!', pickup: 'Patiala Bus Stand', drop: 'Chandigarh Sector 17', time: '8:00 AM', timeAgo: '2 hours ago', upvotes: 15, downvotes: 2, comments: [
        { id: 1, author: 'Manpreet Singh', text: 'Is the pickup from Bus Stand only or can you pick from Mall Road?', time: '1 hour ago' },
        { id: 2, author: 'Simran Kaur', text: 'I am interested! What time exactly will you leave?', time: '45 mins ago' },
        { id: 3, author: 'Rajesh Kumar', text: '@Simran Sharp 8 AM. Be ready at bus stand by 7:55 AM', time: '30 mins ago' }
      ] },
      { id: 'cp2', authorName: 'Priya Singh', vehicleNumber: 'PB11-DK-8765', trustScore: 96.2, category: 'alert', title: 'Heavy Traffic Near Railway Station', description: 'Avoid Railway Road! Major traffic jam due to VIP movement. Police checking at every signal. Better to take alternate route via Fountain Chowk.', pickup: 'Railway Station Road', time: 'Expected till 6 PM', timeAgo: '4 hours ago', upvotes: 23, downvotes: 1, comments: [
        { id: 4, author: 'Karan Verma', text: 'Thanks for the update! Saved me 30 mins', time: '3 hours ago' },
        { id: 5, author: 'Anjali Sharma', text: 'Still heavy traffic? I need to go that side', time: '2 hours ago' },
        { id: 6, author: 'Ravi Kumar', text: 'Yes, better take Fountain Chowk route', time: '1 hour ago' },
        { id: 7, author: 'Deepak Singh', text: 'VIP movement happens every week 😤', time: '30 mins ago' }
      ] },
      { id: 'cp3', authorName: 'Amarjeet Brar', vehicleNumber: 'PB11-AB-3210', trustScore: 94.8, category: 'alert', title: 'Heavy Rain Expected This Evening', description: 'Met department has issued warning for heavy rainfall between 5-8 PM. Roads near Baradari Garden might get waterlogged. Drive carefully!', extra: 'Rainfall: 40-50mm | Low visibility expected', timeAgo: '6 hours ago', upvotes: 18, downvotes: 0, comments: [
        { id: 8, author: 'Navdeep Kaur', text: 'Thanks for the heads up! Will leave office early', time: '5 hours ago' },
        { id: 9, author: 'Jagdeep Singh', text: 'Baradari Garden area always floods during rain', time: '4 hours ago' },
        { id: 10, author: 'Pooja Sharma', text: 'Is this confirmed? Weather looks clear right now', time: '3 hours ago' },
        { id: 11, author: 'Amarjeet Brar', text: '@Pooja Yes, IMD issued warning. Better be safe', time: '2 hours ago' },
        { id: 12, author: 'Harman Singh', text: 'Already started drizzling near Tripuri', time: '1 hour ago' }
      ] },
      { id: 'cp4', authorName: 'Gurpreet Dhillon', vehicleNumber: 'PB11-GS-7732', trustScore: 98.1, category: 'ride', title: 'Daily Route to Rajpura - Share Ride', description: 'I travel daily from Patiala to Rajpura for work. Leaving at 9 AM, returning at 6 PM. Looking for regular passengers to share petrol costs. Reliable and punctual.', pickup: 'Patiala (Various Pickup Points)', drop: 'Rajpura Industrial Area', time: 'Daily (Mon-Sat)', timeAgo: '8 hours ago', upvotes: 12, downvotes: 3, comments: [
        { id: 13, author: 'Akash Rai', text: 'What will be the monthly cost?', time: '7 hours ago' },
        { id: 14, author: 'Gurpreet Dhillon', text: '@Akash Around 2500-3000 per month depending on petrol prices', time: '6 hours ago' },
        { id: 15, author: 'Meena Devi', text: 'Can you pick from near Punjabi University?', time: '5 hours ago' }
      ] },
      { id: 'cp5', authorName: 'Harpreet Kaur', vehicleNumber: 'PB11-HK-5544', trustScore: 93.7, category: 'alert', title: 'Road Construction at Civil Lines', description: 'Major road repair work started at Civil Lines crossing. Only one lane is open. Expect 20-30 minutes delay during peak hours. Work will continue for next 3 days.', pickup: 'Civil Lines Main Road', time: 'Valid till Nov 23', timeAgo: '10 hours ago', upvotes: 9, downvotes: 9, comments: [
        { id: 16, author: 'Sunil Gupta', text: 'This is so annoying! They never finish work on time', time: '9 hours ago' },
        { id: 17, author: 'Neha Aggarwal', text: 'Alternate route via Medical College Road is also better', time: '8 hours ago' },
        { id: 18, author: 'Vikram Sethi', text: 'Thanks for the update', time: '7 hours ago' },
        { id: 19, author: 'Priya Bhatia', text: 'Road was already in bad condition, needed repair', time: '6 hours ago' },
        { id: 20, author: 'Rohit Sharma', text: 'Why do they always start during morning hours?', time: '5 hours ago' },
        { id: 21, author: 'Mohit Kumar', text: 'At least they are fixing it. Stop complaining', time: '4 hours ago' }
      ] },
      { id: 'cp6', authorName: 'Sukhwinder Sandhu', vehicleNumber: 'PB11-SS-9012', trustScore: 99.2, category: 'ride', title: 'Weekend Trip to Kasauli - Join Us!', description: 'Planning a weekend getaway to Kasauli this Saturday. Have space for 2 more people in my SUV. Split fuel and toll costs. Fun group, good music, great vibes!', pickup: 'Patiala', drop: 'Kasauli Hills', time: 'Saturday 6 AM', timeAgo: '12 hours ago', upvotes: 20, downvotes: 1, comments: [
        { id: 22, author: 'Tanvi Malhotra', text: 'Sounds fun! What will be the total cost per person?', time: '11 hours ago' },
        { id: 23, author: 'Sukhwinder Sandhu', text: '@Tanvi Around 800-1000 including fuel and toll', time: '10 hours ago' },
        { id: 24, author: 'Arjun Singh', text: 'Count me in! Where exactly is the pickup point?', time: '9 hours ago' },
        { id: 25, author: 'Sukhwinder Sandhu', text: '@Arjun Mall Road near Neelam Cinema. 6 AM sharp', time: '8 hours ago' },
        { id: 26, author: 'Kavita Sharma', text: 'Will you stay for one day or same day return?', time: '7 hours ago' },
        { id: 27, author: 'Sukhwinder Sandhu', text: '@Kavita Same day return. Back by 8-9 PM', time: '6 hours ago' },
        { id: 28, author: 'Rahul Mehta', text: 'Great plan! I might join too', time: '5 hours ago' }
      ] },
      { id: 'cp7', authorName: 'Navjot Sidhu', vehicleNumber: 'PB11-NS-6789', trustScore: 95.8, category: 'ride', title: 'Going to Ludhiana Tomorrow Morning', description: 'Traveling to Ludhiana for business meeting. Leaving at 7 AM from Patiala. Have 2 empty seats. Preferably looking for people going to GT Road area.', pickup: 'Patiala Chotti Baradari', drop: 'Ludhiana GT Road', time: 'Tomorrow 7 AM', timeAgo: '14 hours ago', upvotes: 8, downvotes: 1, comments: [
        { id: 29, author: 'Sandeep Kaur', text: 'I need to go to Ludhiana. Can you drop near Clock Tower?', time: '13 hours ago' },
        { id: 30, author: 'Navjot Sidhu', text: '@Sandeep Yes, Clock Tower is on the way', time: '12 hours ago' },
        { id: 31, author: 'Bhupinder Singh', text: 'What time will you reach Ludhiana?', time: '11 hours ago' }
      ] },
      { id: 'cp8', authorName: 'Jasleen Kaur', vehicleNumber: 'PB11-JK-2233', trustScore: 96.7, category: 'alert', title: 'Petrol Pump Strike Tomorrow', description: 'All petrol pumps in Patiala will remain closed tomorrow from 6 AM to 6 PM due to strike. Fill your tanks today itself!', pickup: 'All Patiala Petrol Pumps', time: 'Tomorrow 6 AM - 6 PM', timeAgo: '5 hours ago', upvotes: 32, downvotes: 2, comments: [
        { id: 32, author: 'Harpreet Gill', text: 'Thanks for the info! Going to fill tank right now', time: '4 hours ago' },
        { id: 33, author: 'Kuldeep Singh', text: 'Is this confirmed? I heard only some pumps are striking', time: '3 hours ago' },
        { id: 34, author: 'Jasleen Kaur', text: '@Kuldeep Yes confirmed. Better fill tank to be safe', time: '2 hours ago' },
        { id: 35, author: 'Ramesh Kumar', text: 'Long queues already at all pumps', time: '1 hour ago' }
      ] },
      { id: 'cp9', authorName: 'Bikramjit Singh', vehicleNumber: 'PB11-BS-9988', trustScore: 92.3, category: 'ride', title: 'Mohali Airport Drop - Tomorrow 5 AM', description: 'Need 1-2 passengers going to Mohali Airport tomorrow morning. My flight is at 7:30 AM. Can share cab cost. Very economical!', pickup: 'Patiala Baradari Garden', drop: 'Mohali Airport', time: 'Tomorrow 5 AM', timeAgo: '3 hours ago', upvotes: 6, downvotes: 0, comments: [
        { id: 36, author: 'Simranjit Kaur', text: 'I need to reach airport by 6:30 AM. Can I join?', time: '2 hours ago' },
        { id: 37, author: 'Bikramjit Singh', text: '@Simranjit Perfect timing! Yes you can join', time: '1 hour ago' }
      ] },
      { id: 'cp10', authorName: 'Harmanpreet Kaur', vehicleNumber: 'PB11-HM-4455', trustScore: 97.9, category: 'alert', title: 'Accident on Patiala-Sangrur Road', description: 'Major accident near Ghanaur. Traffic is completely stopped. If going towards Sangrur, take alternate route via Samana. Ambulance and police on spot.', pickup: 'Ghanaur Area', time: 'Right Now', timeAgo: '30 mins ago', upvotes: 45, downvotes: 0, comments: [
        { id: 38, author: 'Gurpreet Singh', text: 'Hope everyone is safe. How long will it take to clear?', time: '25 mins ago' },
        { id: 39, author: 'Harmanpreet Kaur', text: '@Gurpreet Police said at least 2 hours', time: '20 mins ago' },
        { id: 40, author: 'Jaspreet Kaur', text: 'Stuck in this traffic for 45 mins now 😞', time: '15 mins ago' },
        { id: 41, author: 'Maninder Singh', text: 'Thanks for update. Taking Samana route', time: '10 mins ago' },
        { id: 42, author: 'Amarjit Singh', text: 'Is anyone hurt badly? Prayers for everyone', time: '5 mins ago' }
      ] }
    ];
  });

  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    sessionStorage.setItem('acceptedRides', JSON.stringify(acceptedRides));
  }, [acceptedRides]);

  const handleAcceptRide = (postId, driverName) => {
    // Store driver name in localStorage
    localStorage.setItem('chatDriverName', driverName);
    localStorage.setItem('openChat', 'true');
    
    // Update user stats - increase rides and trust score
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"trustScore": 95, "ridesShared": 127}');
    userStats.ridesShared = (userStats.ridesShared || 127) + 1;
    userStats.trustScore = Math.min(100, (userStats.trustScore || 95) + 0.5);
    localStorage.setItem('userStats', JSON.stringify(userStats));
    
    // Add to accepted rides (only for current session)
    setAcceptedRides(prev => [...prev, postId]);
    
    alert(` Ride Request Sent to ${driverName}!\n\nOpening chat...`);
    setTimeout(() => {
      navigate('/account');
    }, 500);
  };

  const handleUpvote = (postId) => {
    setCommunityPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  const handleDownvote = (postId) => {
    setCommunityPosts(prev => {
      const updatedPosts = prev.map(post => {
        if (post.id === postId) {
          const newDownvotes = post.downvotes + 1;
          
          // Show alert and delete if downvotes reach 10
          if (newDownvotes >= 10) {
            alert(` Post Removed!\n\nThis post has been deleted due to receiving 10 or more downvotes.\n\nPost: "${post.title}"\nAuthor: ${post.authorName}`);
          }
          
          return { ...post, downvotes: newDownvotes };
        }
        return post;
      });
      
      // Remove posts with 10 or more downvotes
      return updatedPosts.filter(post => post.downvotes < 10);
    });
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId) => {
    const text = commentText[postId];
    if (!text || text.trim() === '') return;
    
    const newComment = {
      id: Date.now(),
      author: driverData.name || 'Anonymous',
      text: text.trim(),
      time: 'Just now'
    };
    
    setCommunityPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    
    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="feed-page">
      <div className="feed-header">
        <div className="header-content">
          <div className="header-title">
            <h1> Community Feed</h1>
            <p className="location-tag">📍 Patiala (PB11)</p>
          </div>
          <div className="filter-tabs">
            <button className="filter-tab active">All Posts</button>
        
          </div>
        </div>
      </div>

      <div className="feed-container">
        <div className="feed-content">
          {/* User's Own Posts */}
          {userPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">{post.authorAvatar}</div>
                  <div className="author-info">
                    <div className="author-header">
                      <h4 className="author-name">{post.authorName} <span className="you-badge">You</span></h4>
                      <div className="author-badges">
                        <span className="community-tag">🏆 Patiala Community</span>
                      </div>
                    </div>
                    <div className="author-meta">
                      <span className="vehicle-tag">🚗 {post.vehicleNumber}</span>
                      <span className="trust-tag">🛡️ {post.trustScore}% Trust</span>
                    </div>
                    <span className="post-time">{post.timeAgo}</span>
                  </div>
                </div>
                <span className={`post-category ${post.category}`}>
                  {post.category === 'ride' ? '🚗 Ride Share' : '⚠️ Alert'}
                </span>
              </div>
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description}</p>
                <div className="post-locations">
                  <div className="location-item">
                    <span className="location-icon">📍</span>
                    <span className="location-text">{post.pickupPoint}</span>
                  </div>
                  <div className="location-arrow">→</div>
                  <div className="location-item">
                    <span className="location-icon"></span>
                    <span className="location-text">{post.dropPoint}</span>
                  </div>
                </div>
              </div>
              <div className="post-actions">
                <button className="action-btn">
                  <span className="btn-icon">💬</span>
                  <span>Chat</span>
                </button>
              </div>
            </div>
          ))}

          {/* Community Posts */}
          {communityPosts.filter(post => !acceptedRides.includes(post.id)).map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <div className="author-header">
                      <h4 className="author-name">{post.authorName}</h4>
                    </div>
                    <div className="author-meta">
                      <span className="community-tag">🏆 Patiala</span>
                      <span className="vehicle-tag">🚗 {post.vehicleNumber}</span>
                      <span className="trust-tag">🛡️ {post.trustScore}% Trust</span>
                    </div>
                    <span className="post-time">{post.timeAgo}</span>
                  </div>
                </div>
                <span className={`post-category ${post.category}`}>
                  {post.category === 'ride' ? ' Ride Share' : ' Alert'}
                </span>
              </div>
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description}</p>
                {post.pickup && (
                  <div className="post-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{post.pickup}</span>
                    </div>
                    {post.drop && (
                      <div className="detail-item">
                        <span className="detail-icon"></span>
                        <span>{post.drop}</span>
                      </div>
                    )}
                    {post.time && (
                      <div className="detail-item">
                        <span className="detail-icon"></span>
                        <span>{post.time}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="post-actions">
                <div className="vote-buttons">
                  <button className="vote-btn upvote" onClick={() => handleUpvote(post.id)}>
                    <span>👍</span>
                    <span>{post.upvotes}</span>
                  </button>
                  <button className="vote-btn downvote" onClick={() => handleDownvote(post.id)}>
                    <span>👎</span>
                    <span>{post.downvotes}</span>
                  </button>
                </div>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => toggleComments(post.id)}>
                    <span>💬</span>
                    <span>Comment ({post.comments.length})</span>
                  </button>
                  {post.category === 'ride' && (
                    <button className="action-btn accept-ride-btn" onClick={() => handleAcceptRide(post.id, post.authorName)}>
                      <span>✅</span>
                      <span>Accept Ride</span>
                    </button>
                  )}
                </div>
              </div>

              {showComments[post.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-author">
                          <span className="comment-avatar">👤</span>
                          <span className="comment-name">{comment.author}</span>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="comment-input-box">
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <button className="comment-submit-btn" onClick={() => handleAddComment(post.id)}>
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="feed-sidebar">
          <div className="sidebar-card chat-card">
            <h3 className="sidebar-title">💬 Messages</h3>
            <p className="chat-subtitle">Stay connected with your community</p>
            <button 
              className="view-chats-btn"
              onClick={() => navigate('/chats')}
            >
              <span></span>
              <span>View All Chats</span>
            </button>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">🔥 Trending Alerts</h3>
            <div className="trending-video-container">
              <iframe 
                width="100%" 
                height="180"
                src="https://www.youtube.com/embed/hlisAvTFBtU?autoplay=1&mute=1&loop=1&playlist=hlisAvTFBtU"
                title="Road Safety Alert"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                // allowFullScreen
                style={{ borderRadius: '8px', marginBottom: '10px' }}
              ></iframe>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                🚨 Safety Alert: Important traffic update for PB11 drivers
              </p>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">🌤️ Weather Update</h3>
            <div className="weather-widget">
              <div className="weather-temp">28°C</div>
              <p className="weather-condition">Partly Cloudy</p>
              <p className="weather-location">Patiala, Punjab</p>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">📊 Community Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Active Drivers</span>
                <span className="stat-value">1,247</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rides Today</span>
                <span className="stat-value">342</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Alerts Posted</span>
                <span className="stat-value">28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
