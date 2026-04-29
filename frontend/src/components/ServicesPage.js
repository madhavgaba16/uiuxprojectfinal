import React, { useState } from 'react';
import './ServicesPage.css';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('nearest');

  const categories = [
    { id: 'mechanic', name: 'Mechanics', color: '#3b82f6' },
    { id: 'fuel', name: 'Fuel Stations', color: '#d97706' },
    { id: 'puncture', name: 'Tyre Puncture', color: '#dc2626' },
    { id: 'carwash', name: 'Car Wash', color: '#2563eb' },
    { id: 'accessories', name: 'Car Accessories', color: '#7c3aed' },
    { id: 'hospital', name: 'Hospitals', color: '#059669' },
    { id: 'restaurant', name: 'Restaurants', color: '#d97706' },
    { id: 'battery', name: 'Battery Service', color: '#db2777' },
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

  const filterButtons = [
    { key: 'nearest', label: 'Nearest' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'open', label: 'Open Now' },
  ];

  return (
    <div className="services-page">
      <div className="page-container services-container-wide">
        <div className="page-header">
          {selectedCategory ? (
            <div className="svc-header-row">
              <button className="btn-secondary svc-back-btn" onClick={handleBackToCategories}>
                Back
              </button>
              <div>
                <h1 className="page-title">{selectedCategory.name}</h1>
                <p className="page-subtitle">Nearby services in Patiala</p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="page-title">Essential Services</h1>
              <p className="page-subtitle">Find nearby services for drivers</p>
            </>
          )}
        </div>

        {!selectedCategory ? (
          /* Categories Grid View */
          <div className="svc-categories-view">
            <p className="svc-prompt">Select a category to find nearby services</p>

            <div className="svc-categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="card svc-category-card"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="svc-category-card__name">{category.name}</span>
                  <span className="svc-category-card__arrow">&rarr;</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Services List View */
          <div className="svc-list-view">
            {/* Filter buttons */}
            <div className="svc-filters">
              {filterButtons.map((fb) => (
                <button
                  key={fb.key}
                  className={`svc-filter-btn ${sortBy === fb.key ? 'svc-filter-btn--active' : ''}`}
                  onClick={() => setSortBy(fb.key)}
                >
                  {fb.label}
                </button>
              ))}
            </div>

            {/* Service cards */}
            <div className="svc-list">
              {getSortedServices().length > 0 ? (
                getSortedServices().map((service) => (
                  <div key={service.id} className="card svc-card">
                    <div className="svc-card__top">
                      <div className="svc-card__info">
                        <h3 className="svc-card__name">{service.name}</h3>
                        <span className="svc-card__rating">{service.rating}/5</span>
                      </div>
                      <span className={`svc-status ${service.isOpen ? 'svc-status--open' : 'svc-status--closed'}`}>
                        {service.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <div className="svc-card__details">
                      <div className="svc-card__detail">
                        <span className="svc-card__detail-label">Address</span>
                        <span className="svc-card__detail-value">{service.address}</span>
                      </div>
                      <div className="svc-card__detail">
                        <span className="svc-card__detail-label">Distance</span>
                        <span className="svc-card__detail-value">{service.distance}</span>
                      </div>
                      <div className="svc-card__detail">
                        <span className="svc-card__detail-label">Phone</span>
                        <span className="svc-card__detail-value">{service.phone}</span>
                      </div>
                      <div className="svc-card__detail">
                        <span className="svc-card__detail-label">Hours</span>
                        <span className="svc-card__detail-value">Closes at {service.closes}</span>
                      </div>
                    </div>

                    <div className="svc-card__actions">
                      <button
                        className="btn-primary svc-action-btn"
                        onClick={() => window.location.href = `tel:${service.phone}`}
                      >
                        Call
                      </button>
                      <button className="btn-secondary svc-action-btn">
                        Directions
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="svc-empty">
                  <h3 className="svc-empty__title">No Services Found</h3>
                  <p className="svc-empty__text">All shops are currently closed. Try selecting "Nearest" or "Top Rated" filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
