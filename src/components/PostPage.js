import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPage.css';

const PostPage = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState('ride'); // 'ride' or 'alert'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pickupPoint: '',
    dropPoint: '',
    customerDetails: ''
  });

  // Get logged-in driver data
  const driverData = JSON.parse(localStorage.getItem('driverData') || '{}');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get user stats from localStorage
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"trustScore": 95, "ridesShared": 127}');
    
    // Create new post with driver data and stats
    const newPost = {
      id: Date.now(),
      authorName: driverData.name || 'Driver',
      authorAvatar: '👤',
      vehicleNumber: driverData.vehicleNumber || 'PB11-XX-XXXX',
      trustScore: userStats.trustScore || 95,
      type: postType,
      category: postType === 'ride' ? 'ride' : 'alert',
      title: formData.title,
      description: formData.description,
      pickupPoint: formData.pickupPoint,
      dropPoint: formData.dropPoint,
      customerDetails: formData.customerDetails,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now'
    };
    
    // Get existing posts from localStorage
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    
    // Add new post at the beginning
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));
    
    // Increase rides shared count and trust score
    if (postType === 'ride') {
      userStats.ridesShared = (userStats.ridesShared || 127) + 1;
      userStats.trustScore = Math.min(100, (userStats.trustScore || 95) + 0.5);
      localStorage.setItem('userStats', JSON.stringify(userStats));
    }
    
    // Show success message and navigate
    alert(`✅ Your ${postType === 'ride' ? 'ride share' : 'alert'} has been posted successfully!`);
    navigate('/feed');
  };

  return (
    <div className="post-page">
      <div className="post-container">
        <div className="post-header">
          <button className="back-btn" onClick={() => navigate('/feed')}>
            <span>←</span>
          </button>
          <h1>Create New Post</h1>
          <div className="header-spacer"></div>
        </div>

        <div className="post-type-selector">
          <button
            className={`type-btn ${postType === 'ride' ? 'active' : ''}`}
            onClick={() => setPostType('ride')}
          >
            <span className="type-icon">🚗</span>
            <div className="type-info">
              <h3>Ride Share</h3>
              <p>Share your ride with others</p>
            </div>
          </button>
          <button
            className={`type-btn ${postType === 'alert' ? 'active' : ''}`}
            onClick={() => setPostType('alert')}
          >
            <span className="type-icon">⚠️</span>
            <div className="type-info">
              <h3>Alert</h3>
              <p>Post traffic or weather alerts</p>
            </div>
          </button>
        </div>

        <form className="post-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="title">
              <span className="label-icon">📝</span>
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={postType === 'ride' ? 'e.g., Going to Chandigarh - 3 seats available' : 'e.g., Heavy traffic near Railway Station'}
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="description">
              <span className="label-icon">💬</span>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={postType === 'ride' ? 'Provide details about your ride, timing, and any preferences' : 'Describe the situation, location, and any important details'}
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="pickupPoint">
                <span className="label-icon">📍</span>
                {postType === 'ride' ? 'Pickup Point' : 'Location / Starting Point'}
              </label>
              <input
                type="text"
                id="pickupPoint"
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-section">
              <label htmlFor="dropPoint">
                <span className="label-icon">🎯</span>
                {postType === 'ride' ? 'Drop Point' : 'Destination / End Point'}
              </label>
              <input
                type="text"
                id="dropPoint"
                name="dropPoint"
                value={formData.dropPoint}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          {postType === 'ride' && (
            <div className="form-section">
              <label htmlFor="customerDetails">
                <span className="label-icon">👥</span>
                Customer Details (Optional)
              </label>
              <input
                type="text"
                id="customerDetails"
                name="customerDetails"
                value={formData.customerDetails}
                onChange={handleChange}
                placeholder="Number of passengers, contact info, etc."
              />
            </div>
          )}

          <div className="post-preview">
            <h3>Preview</h3>
            <div className="preview-card">
              <div className="preview-header">
                <span className={`preview-badge ${postType}`}>
                  {postType === 'ride' ? '🚗 Ride Share' : '⚠️ Alert'}
                </span>
              </div>
              <h4>{formData.title || 'Your post title...'}</h4>
              <p>{formData.description || 'Your description...'}</p>
              {(formData.pickupPoint || formData.dropPoint) && (
                <div className="preview-locations">
                  {formData.pickupPoint && (
                    <div className="preview-location">
                      <span>📍</span>
                      <span>{formData.pickupPoint}</span>
                    </div>
                  )}
                  {formData.dropPoint && (
                    <div className="preview-location">
                      <span></span>
                      <span>{formData.dropPoint}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/feed')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              <span>Publish Post</span>
              <span className="btn-icon">✓</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
