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
    return (
      <div className="page-container">
        <p className="feed-loading">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Community Feed</h1>
        <p className="page-subtitle">Patiala (PB11)</p>
      </div>

      <div className="feed-content">
        {posts.length === 0 && (
          <div className="card feed-empty">
            <h3 className="feed-empty-title">No posts yet</h3>
            <p className="feed-empty-text">Create a new ride share or alert post to see it here.</p>
          </div>
        )}

        {userPosts.map((post) => (
          <div key={post.id} className="card post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="avatar-circle">
                  {(post.authorName || '?').charAt(0).toUpperCase()}
                </div>
                <div className="post-author-info">
                  <div className="post-author-name">
                    {post.authorName}
                    <span className="badge post-you-badge">You</span>
                  </div>
                  <div className="post-meta-row">
                    <span className="post-meta-tag">{post.vehicleNumber}</span>
                    <span className="post-meta-tag">{post.trustScore}% Trust</span>
                  </div>
                  <span className="post-time">{post.timeAgo}</span>
                </div>
              </div>
              <span className={`badge ${post.category === 'alert' ? 'badge-warning' : ''}`}>
                {post.category === 'ride' ? 'Ride Share' : 'Alert'}
              </span>
            </div>
            <div className="post-body">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-description">{post.description}</p>
            </div>
          </div>
        ))}

        {communityPosts.map((post) => (
          <div key={post.id} className="card post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="avatar-circle">
                  {(post.authorName || '?').charAt(0).toUpperCase()}
                </div>
                <div className="post-author-info">
                  <div className="post-author-name">{post.authorName}</div>
                  <div className="post-meta-row">
                    <span className="post-meta-tag">Patiala</span>
                    <span className="post-meta-tag">{post.vehicleNumber}</span>
                    <span className="post-meta-tag">{post.trustScore}% Trust</span>
                  </div>
                  <span className="post-time">{post.timeAgo}</span>
                </div>
              </div>
              <span className={`badge ${post.category === 'alert' ? 'badge-warning' : ''}`}>
                {post.category === 'ride' ? 'Ride Share' : 'Alert'}
              </span>
            </div>

            <div className="post-body">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-description">{post.description}</p>
              {post.pickup && (
                <div className="post-locations">
                  <span className="post-location-item">From: {post.pickup}</span>
                  {post.drop && (
                    <span className="post-location-item">To: {post.drop}</span>
                  )}
                </div>
              )}
            </div>

            <div className="post-actions">
              <div className="post-actions-left">
                <button
                  className="btn-secondary post-vote-btn"
                  onClick={() => handleVote(post.id, 'upvote')}
                >
                  + {post.upvotes}
                </button>
                <button
                  className="btn-secondary post-vote-btn"
                  onClick={() => handleVote(post.id, 'downvote')}
                >
                  - {post.downvotes}
                </button>
                <button
                  className="btn-secondary post-comment-btn"
                  onClick={() => toggleComments(post.id)}
                >
                  Comment ({(post.comments || []).length})
                </button>
              </div>
              {post.category === 'ride' && (
                <button
                  className="btn-primary post-accept-btn"
                  onClick={() => handleAcceptRide(post)}
                >
                  Accept Ride
                </button>
              )}
            </div>

            {showComments[post.id] && (
              <div className="post-comments">
                <div className="post-comments-list">
                  {(post.comments || []).map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-time">{comment.time}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="comment-input-row">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button className="btn-primary" onClick={() => handleAddComment(post.id)}>
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
