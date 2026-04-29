import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPage.css';
import { postsApi } from '../api';

const PostPage = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState('ride');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pickupPoint: '',
    dropPoint: '',
    customerDetails: ''
  });

  const driverData = JSON.parse(localStorage.getItem('driverData') || '{}');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driverData._id) {
      alert('Please login again to create a post.');
      navigate('/');
      return;
    }

    try {
      await postsApi.create({
        driverId: driverData._id,
        category: postType === 'ride' ? 'ride' : 'alert',
        title: formData.title,
        description: formData.description,
        pickupPoint: formData.pickupPoint,
        dropPoint: formData.dropPoint,
        customerDetails: formData.customerDetails
      });

      alert(`Your ${postType === 'ride' ? 'ride share' : 'alert'} has been posted successfully.`);
      navigate('/feed');
    } catch (error) {
      alert(`Unable to publish post: ${error.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header post-page-header">
        <button className="btn-secondary post-back-btn" onClick={() => navigate('/feed')}>
          &#8592; Back
        </button>
        <h1 className="page-title">Create New Post</h1>
      </div>

      <div className="post-type-selector">
        <button
          className={`btn-secondary post-type-btn ${postType === 'ride' ? 'post-type-active' : ''}`}
          onClick={() => setPostType('ride')}
        >
          Ride Share
        </button>
        <button
          className={`btn-secondary post-type-btn ${postType === 'alert' ? 'post-type-active' : ''}`}
          onClick={() => setPostType('alert')}
        >
          Alert
        </button>
      </div>

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="card post-form-card">
          <div className="post-form-group">
            <label className="form-label" htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              placeholder={postType === 'ride' ? 'e.g., Going to Chandigarh - 3 seats available' : 'e.g., Heavy traffic near Railway Station'}
              required
            />
          </div>

          <div className="post-form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="input-field"
              value={formData.description}
              onChange={handleChange}
              placeholder={postType === 'ride' ? 'Provide details about your ride, timing, and any preferences' : 'Describe the situation, location, and any important details'}
              rows="5"
              required
            />
          </div>

          <div className="post-form-row">
            <div className="post-form-group">
              <label className="form-label" htmlFor="pickupPoint">
                {postType === 'ride' ? 'Pickup Point' : 'Location / Starting Point'}
              </label>
              <input
                type="text"
                id="pickupPoint"
                name="pickupPoint"
                className="input-field"
                value={formData.pickupPoint}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="post-form-group">
              <label className="form-label" htmlFor="dropPoint">
                {postType === 'ride' ? 'Drop Point' : 'Destination / End Point'}
              </label>
              <input
                type="text"
                id="dropPoint"
                name="dropPoint"
                className="input-field"
                value={formData.dropPoint}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          {postType === 'ride' && (
            <div className="post-form-group">
              <label className="form-label" htmlFor="customerDetails">
                Customer Details (Optional)
              </label>
              <input
                type="text"
                id="customerDetails"
                name="customerDetails"
                className="input-field"
                value={formData.customerDetails}
                onChange={handleChange}
                placeholder="Number of passengers, contact info, etc."
              />
            </div>
          )}
        </div>

        <div className="card post-preview-card">
          <h3 className="post-preview-heading">Preview</h3>
          <div className="post-preview-content">
            <span className={`badge ${postType === 'alert' ? 'badge-warning' : ''}`}>
              {postType === 'ride' ? 'Ride Share' : 'Alert'}
            </span>
            <h4 className="post-preview-title">{formData.title || 'Your post title...'}</h4>
            <p className="post-preview-desc">{formData.description || 'Your description...'}</p>
            {(formData.pickupPoint || formData.dropPoint) && (
              <div className="post-preview-locations">
                {formData.pickupPoint && (
                  <span className="post-preview-loc">From: {formData.pickupPoint}</span>
                )}
                {formData.dropPoint && (
                  <span className="post-preview-loc">To: {formData.dropPoint}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="post-form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/feed')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostPage;
