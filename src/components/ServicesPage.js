import React, { useState } from 'react';
import './ServicesPage.css';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('nearest');

  const categories = [
    { id: 'mechanic', name: 'Mechanics', icon: '🔧', color: '#3b82f6' },
    { id: 'fuel', name: 'Fuel Stations', icon: '⛽', color: '#fbbf24' },
    { id: 'puncture', name: 'Tyre Puncture', icon: '🛞', color: '#f87171' },
    { id: 'carwash', name: 'Car Wash', icon: '🚿', color: '#60a5fa' },
    { id: 'accessories', name: 'Car Accessories', icon: '🛒', color: '#8b5cf6' },
    { id: 'hospital', name: 'Hospitals', icon: '🏥', color: '#10b981' },
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️', color: '#f59e0b' },
    { id: 'battery', name: 'Battery Service', icon: '🔋', color: '#ec4899' }
  ];

  const servicesData = {
    mechanic: [
      { id: 1, name: 'Sharma Auto Works', rating: 4.7, address: 'Near Bus Stand, Mall Road', distance: '1.2 km', phone: '+91 98765-11111', closes: '9:00 PM', isOpen: true },
      { id: 2, name: 'Singh Motors', rating: 4.5, address: 'Civil Lines, Patiala', distance: '2.5 km', phone: '+91 98765-22222', closes: '8:00 PM', isOpen: true },
      { id: 3, name: 'Patiala Car Service Center', rating: 4.8, address: 'Fountain Chowk', distance: '3.1 km', phone: '+91 98765-33333', closes: '10:00 PM', isOpen: true },
      { id: 4, name: 'Quick Fix Garage', rating: 4.3, address: 'Rajpura Road', distance: '4.5 km', phone: '+91 98765-44444', closes: '7:00 PM', isOpen: false },
      { id: 5, name: 'Elite Auto Repair', rating: 4.9, address: 'Urban Estate Phase 2', distance: '3.8 km', phone: '+91 98765-45454', closes: '6:00 PM', isOpen: false },
      { id: 6, name: 'Royal Car Workshop', rating: 4.6, address: 'Leela Bhawan Road', distance: '5.5 km', phone: '+91 98765-46464', closes: '7:30 PM', isOpen: false },
    ],
    fuel: [
      { id: 1, name: 'HP Petrol Pump', rating: 4.6, address: 'Mall Road, Near Railway Station', distance: '0.8 km', phone: '+91 98765-55555', closes: '24 Hours', isOpen: true },
      { id: 2, name: 'Indian Oil Station', rating: 4.4, address: 'Sangrur Road', distance: '2.3 km', phone: '+91 98765-66666', closes: '24 Hours', isOpen: true },
      { id: 3, name: 'Bharat Petroleum', rating: 4.5, address: 'Rajpura Road, Patiala', distance: '3.7 km', phone: '+91 98765-77777', closes: '11:00 PM', isOpen: true },
      { id: 4, name: 'Shell Petrol Pump', rating: 4.7, address: 'NH-64, Patiala', distance: '5.2 km', phone: '+91 98765-88888', closes: '24 Hours', isOpen: true },
      { id: 5, name: 'Reliance Petrol Pump', rating: 4.8, address: 'Baradari Garden Road', distance: '4.2 km', phone: '+91 98765-89898', closes: '10:00 PM', isOpen: false },
    ],
    puncture: [
      { id: 1, name: 'Fast Tyre Repair', rating: 4.4, address: 'Bus Stand Area', distance: '0.5 km', phone: '+91 98765-99999', closes: '9:30 PM', isOpen: true },
      { id: 2, name: 'Puncture Fix Point', rating: 4.2, address: 'Fountain Chowk', distance: '1.8 km', phone: '+91 98765-12121', closes: '8:30 PM', isOpen: true },
      { id: 3, name: 'MRF Tyre Shop', rating: 4.6, address: 'Civil Lines', distance: '2.4 km', phone: '+91 98765-13131', closes: '9:00 PM', isOpen: true },
      { id: 4, name: '24x7 Tyre Service', rating: 4.5, address: 'Sangrur Road', distance: '3.9 km', phone: '+91 98765-14141', closes: '24 Hours', isOpen: true },
      { id: 5, name: 'Apollo Tyres Center', rating: 4.8, address: 'Mall Road Extension', distance: '3.2 km', phone: '+91 98765-15151', closes: '7:00 PM', isOpen: false },
      { id: 6, name: 'JK Tyre Showroom', rating: 4.7, address: 'Bhupindra Road', distance: '4.8 km', phone: '+91 98765-16161', closes: '6:30 PM', isOpen: false },
    ],
    carwash: [
      { id: 1, name: 'Sparkle Car Wash', rating: 4.6, address: 'Near Baradari Garden', distance: '1.5 km', phone: '+91 98765-15151', closes: '8:00 PM', isOpen: true },
      { id: 2, name: 'Auto Shine Center', rating: 4.4, address: 'Mall Road', distance: '2.0 km', phone: '+91 98765-16161', closes: '7:30 PM', isOpen: false },
      { id: 3, name: 'Premium Car Spa', rating: 4.8, address: 'Urban Estate Phase 1', distance: '3.2 km', phone: '+91 98765-17171', closes: '9:00 PM', isOpen: true },
      { id: 4, name: 'Express Car Wash', rating: 4.3, address: 'Rajpura Road', distance: '4.1 km', phone: '+91 98765-18181', closes: '8:30 PM', isOpen: true },
      { id: 5, name: 'Crystal Clean Car Wash', rating: 4.9, address: 'Leela Bhawan', distance: '2.8 km', phone: '+91 98765-19191', closes: '6:00 PM', isOpen: false },
      { id: 6, name: 'Ultimate Shine Studio', rating: 4.7, address: 'Sirhind Road', distance: '5.1 km', phone: '+91 98765-20202', closes: '7:00 PM', isOpen: false },
    ],
    accessories: [
      { id: 1, name: 'Auto Parts Hub', rating: 4.5, address: 'Mall Road, Patiala', distance: '1.3 km', phone: '+91 98765-19191', closes: '9:00 PM', isOpen: true },
      { id: 2, name: 'Car Decor Palace', rating: 4.6, address: 'Near Fountain Chowk', distance: '2.1 km', phone: '+91 98765-20202', closes: '8:30 PM', isOpen: true },
      { id: 3, name: 'Speed Accessories', rating: 4.4, address: 'Civil Lines', distance: '2.8 km', phone: '+91 98765-21212', closes: '9:30 PM', isOpen: true },
      { id: 4, name: 'Car Modify Center', rating: 4.7, address: 'Sangrur Road', distance: '4.3 km', phone: '+91 98765-22323', closes: '10:00 PM', isOpen: true },
      { id: 5, name: 'Premium Auto Accessories', rating: 4.9, address: 'Urban Estate Phase 2', distance: '3.5 km', phone: '+91 98765-23434', closes: '7:00 PM', isOpen: false },
      { id: 6, name: 'Car Style Shop', rating: 4.8, address: 'Bhupindra Road', distance: '4.9 km', phone: '+91 98765-24545', closes: '6:30 PM', isOpen: false },
    ],
    hospital: [
      { id: 1, name: 'Rajindra Hospital', rating: 4.3, address: 'Mall Road, Patiala', distance: '1.7 km', phone: '0175-2212345', closes: '24 Hours', isOpen: true },
      { id: 2, name: 'Columbia Asia Hospital', rating: 4.7, address: 'Urban Estate', distance: '3.5 km', phone: '0175-5001000', closes: '24 Hours', isOpen: true },
      { id: 3, name: 'Amar Hospital', rating: 4.4, address: 'Near Bus Stand', distance: '2.2 km', phone: '0175-2213456', closes: '24 Hours', isOpen: true },
      { id: 4, name: 'Max Super Specialty', rating: 4.8, address: 'Rajpura Road', distance: '5.0 km', phone: '0175-5002000', closes: '24 Hours', isOpen: true },
      { id: 5, name: 'City Clinic & Hospital', rating: 4.6, address: 'Civil Lines', distance: '2.9 km', phone: '0175-2214567', closes: '10:00 PM', isOpen: false },
    ],
    restaurant: [
      { id: 1, name: 'Haveli Restaurant', rating: 4.6, address: 'Mall Road, Patiala', distance: '1.1 km', phone: '+91 98765-23434', closes: '11:00 PM', isOpen: true },
      { id: 2, name: 'Punjabi Dhaba', rating: 4.5, address: 'NH-64, Patiala', distance: '2.6 km', phone: '+91 98765-24545', closes: '11:30 PM', isOpen: true },
      { id: 3, name: 'Barbeque Nation', rating: 4.7, address: 'Urban Estate', distance: '3.4 km', phone: '+91 98765-25656', closes: '11:45 PM', isOpen: true },
      { id: 4, name: 'Guru Kripa Dhaba', rating: 4.4, address: 'Sangrur Road', distance: '4.8 km', phone: '+91 98765-26767', closes: '12:00 AM', isOpen: true },
      { id: 5, name: 'Royal Palace Restaurant', rating: 4.9, address: 'Baradari Garden Road', distance: '2.3 km', phone: '+91 98765-27878', closes: '10:30 PM', isOpen: false },
      { id: 6, name: 'Heritage Dining', rating: 4.8, address: 'Old Patiala City', distance: '3.7 km', phone: '+91 98765-28989', closes: '10:00 PM', isOpen: false },
    ],
    battery: [
      { id: 1, name: 'Exide Battery Center', rating: 4.5, address: 'Mall Road', distance: '1.4 km', phone: '+91 98765-27878', closes: '8:00 PM', isOpen: true },
      { id: 2, name: 'Amaron Battery Shop', rating: 4.6, address: 'Bus Stand Area', distance: '2.0 km', phone: '+91 98765-28989', closes: '8:30 PM', isOpen: true },
      { id: 3, name: 'SF Sonic Batteries', rating: 4.4, address: 'Civil Lines', distance: '2.7 km', phone: '+91 98765-29090', closes: '9:00 PM', isOpen: true },
      { id: 4, name: 'Battery World', rating: 4.7, address: 'Rajpura Road', distance: '4.0 km', phone: '+91 98765-30101', closes: '9:30 PM', isOpen: true },
      { id: 5, name: 'Livguard Battery Store', rating: 4.9, address: 'Urban Estate', distance: '3.3 km', phone: '+91 98765-31212', closes: '7:00 PM', isOpen: false },
      { id: 6, name: 'Luminous Power Center', rating: 4.8, address: 'Fountain Chowk', distance: '2.5 km', phone: '+91 98765-32323', closes: '6:30 PM', isOpen: false },
    ],
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSortBy('nearest');
  };

  const getSortedServices = () => {
    if (!selectedCategory) return [];
    
    let services = [...servicesData[selectedCategory.id]];
    
    if (sortBy === 'nearest') {
      services.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === 'rating') {
      services.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'open') {
      services = services.filter(service => service.isOpen);
      services.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
    
    return services;
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <div className="header-content">
          {selectedCategory ? (
            <div className="header-with-back">
              <button className="back-btn" onClick={handleBackToCategories}>
                <span>←</span>
              </button>
              <div className="header-title">
                <h1>
                  <span className="category-icon">{selectedCategory.icon}</span>
                  {selectedCategory.name}
                </h1>
                <p className="subtitle">Nearby services in Patiala</p>
              </div>
            </div>
          ) : (
            <div className="header-title">
              <h1>🛠️ Essential Services</h1>
              <p className="subtitle">Find nearby services for drivers</p>
            </div>
          )}
        </div>
      </div>

      <div className="services-container">
        {!selectedCategory ? (
          /* Categories Grid View */
          <div className="categories-view">
            <div className="view-info">
              <div className="info-icon">📍</div>
              <h2>What service do you need?</h2>
              <p>Select a category to find nearby services</p>
            </div>

            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                  style={{ '--category-color': category.color }}
                >
                  <div className="category-icon-large">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <div className="category-arrow">→</div>
                </div>
              ))}
            </div>

            <div className="features-info">
              <h3>🗺️ Powered By</h3>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">📍</span>
                  <div className="feature-text">
                    <strong>Driver GPS</strong>
                    <small>Real-time location tracking</small>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🗺️</span>
                  <div className="feature-text">
                    <strong>Google Maps API</strong>
                    <small>Accurate nearby search</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Services List View */
          <div className="services-list-view">
            <div className="services-controls">
              
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${sortBy === 'nearest' ? 'active' : ''}`}
                  onClick={() => setSortBy('nearest')}
                >
                  <span>📍</span>
                  <span>Nearest</span>
                </button>
                <button 
                  className={`filter-btn ${sortBy === 'rating' ? 'active' : ''}`}
                  onClick={() => setSortBy('rating')}
                >
                  <span>⭐</span>
                  <span>Top Rated</span>
                </button>
                <button 
                  className={`filter-btn ${sortBy === 'open' ? 'active' : ''}`}
                  onClick={() => setSortBy('open')}
                >
                  <span>🕐</span>
                  <span>Open Now</span>
                </button>
              </div>
            </div>

            <div className="services-list">
              {getSortedServices().length > 0 ? (
                getSortedServices().map((service) => (
                  <div key={service.id} className="service-card">
                  <div className="service-card-content">
                    <div className="service-image">
                      <div className="image-placeholder">
                        <span className="placeholder-icon">{selectedCategory.icon}</span>
                      </div>
                    </div>
                    
                    <div className="service-info">
                      <div className="service-header">
                        <div className="service-main-info">
                          <h3 className="service-name">{service.name}</h3>
                          <div className="service-rating">
                            <span className="star">⭐</span>
                            <span className="rating-value">{service.rating}</span>
                          </div>
                        </div>
                        <div className={`status-badge ${service.isOpen ? 'open' : 'closed'}`}>
                          {service.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </div>
                      </div>

                      <div className="service-details">
                        <div className="detail-row">
                          <span className="detail-icon">📍</span>
                          <span className="detail-text">{service.address}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-icon">📏</span>
                          <span className="detail-text">{service.distance} away</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-icon">📞</span>
                          <span className="detail-text">{service.phone}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-icon">🕐</span>
                          <span className="detail-text">Closes at {service.closes}</span>
                        </div>
                      </div>

                      <div className="service-actions">
                        <button className="action-btn call-btn" onClick={() => window.location.href = `tel:${service.phone}`}>
                          <span>📞</span>
                          <span>Call Now</span>
                        </button>
                        <button className="action-btn directions-btn">
                          <span>🗺️</span>
                          <span>Directions</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="no-services-found">
                  <div className="no-services-icon">🔍</div>
                  <h3>No Services Found</h3>
                  <p>All shops are currently closed. Try selecting "Nearest" or "Top Rated" filter.</p>
                </div>
              )}
            </div>

            {/* Hidden example structure */}
            <div className="example-structure" style={{ display: 'none' }}>
              <div className="service-card">
                <div className="service-image">
                  <img src="" alt="Service" />
                </div>
                <div className="service-info">
                  <div className="service-header">
                    <h3 className="service-name">Service Name</h3>
                    <span className="service-status open">● Open</span>
                  </div>
                  <div className="service-rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-text">4.5 (120 reviews)</span>
                  </div>
                  <p className="service-address">📍 Address goes here</p>
                  <div className="service-details">
                    <span className="detail-item">📞 Phone</span>
                    <span className="detail-item">🕐 Open 24/7</span>
                    <span className="detail-item">📏 2.5 km away</span>
                  </div>
                  <div className="service-actions">
                    <button className="action-btn primary">
                      <span>🗺️</span>
                      <span>Directions</span>
                    </button>
                    <button className="action-btn secondary">
                      <span>📞</span>
                      <span>Call</span>
                    </button>
                    <button className="action-btn secondary">
                      <span>ℹ️</span>
                      <span>Info</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
