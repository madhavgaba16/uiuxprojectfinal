import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatsApi, postsApi } from '../api';
import './FeedPage.css';

const FeedPage = () => {
  const navigate = useNavigate();
  const driverData = JSON.parse(localStorage.getItem('driverData') || '{}');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [acceptedRides, setAcceptedRides] = useState(() => {
    const sessionAccepted = sessionStorage.getItem('acceptedRides');
    return sessionAccepted ? JSON.parse(sessionAccepted) : [];
  });

  const loadPosts = async () => {
    try {
      const data = await postsApi.list();
      setPosts(data.posts || []);
    } catch (error) {
      alert(`Unable to load posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('acceptedRides', JSON.stringify(acceptedRides));
  }, [acceptedRides]);

  const handleAcceptRide = async (post) => {
    try {
      if (driverData._id && post.authorId && post.authorId !== driverData._id) {
        const data = await chatsApi.start({
          driverId: driverData._id,
          otherDriverId: post.authorId
        });
        localStorage.setItem('selectedConversationId', data.conversationId);
      }

      localStorage.setItem('chatDriverName', post.authorName);
      localStorage.setItem('openChat', 'true');
      setAcceptedRides((prev) => [...prev, post.id]);

      alert(`Ride request sent to ${post.authorName}. Opening chat...`);
      navigate('/account');
    } catch (error) {
      alert(`Unable to start chat: ${error.message}`);
    }
  };

  const handleVote = async (postId, type) => {
    try {
      const result = await postsApi.vote(postId, type);
      if (result.removed) {
        alert('Post removed due to high downvotes.');
      }
      await loadPosts();
    } catch (error) {
      alert(`Unable to vote: ${error.message}`);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    try {
      await postsApi.comment(postId, {
        driverId: driverData._id,
        text: text.trim()
      });
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      await loadPosts();
    } catch (error) {
      alert(`Unable to comment: ${error.message}`);
    }
  };

  const userPosts = posts.filter((p) => p.authorId === driverData._id);
  const communityPosts = posts.filter(
    (p) => p.authorId !== driverData._id && !acceptedRides.includes(p.id)
  );

  if (loading) {
    return <div className="feed-page">Loading posts...</div>;
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Community Feed</h1>
            <p className="location-tag">📍 Patiala (PB11)</p>
          </div>
          <div className="filter-tabs">
            <button className="filter-tab active">All Posts</button>
          </div>
        </div>
      </div>

      <div className="feed-container">
        <div className="feed-content">
          {posts.length === 0 && (
            <div className="post-card">
              <div className="post-content">
                <h3 className="post-title">No posts yet</h3>
                <p className="post-description">Create a new ride share or alert post to see it here.</p>
              </div>
            </div>
          )}

          {userPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <div className="author-header">
                      <h4 className="author-name">{post.authorName} <span className="you-badge">You</span></h4>
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
              </div>
            </div>
          ))}

          {communityPosts.map((post) => (
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
                  {post.category === 'ride' ? 'Ride Share' : 'Alert'}
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
                        <span className="detail-icon">🏁</span>
                        <span>{post.drop}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="post-actions">
                <div className="vote-buttons">
                  <button className="vote-btn upvote" onClick={() => handleVote(post.id, 'upvote')}>
                    <span>👍</span>
                    <span>{post.upvotes}</span>
                  </button>
                  <button className="vote-btn downvote" onClick={() => handleVote(post.id, 'downvote')}>
                    <span>👎</span>
                    <span>{post.downvotes}</span>
                  </button>
                </div>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => toggleComments(post.id)}>
                    <span>💬</span>
                    <span>Comment ({(post.comments || []).length})</span>
                  </button>
                  {post.category === 'ride' && (
                    <button className="action-btn accept-ride-btn" onClick={() => handleAcceptRide(post)}>
                      <span>✅</span>
                      <span>Accept Ride</span>
                    </button>
                  )}
                </div>
              </div>

              {showComments[post.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {(post.comments || []).map((comment) => (
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
                      onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
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
            <button className="view-chats-btn" onClick={() => navigate('/chats')}>
              <span>View All Chats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
