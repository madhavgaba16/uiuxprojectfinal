import React from 'react';
import './IntroPage.css';
import driverImage from '../driver.png';

const IntroPage = ({ onEnter }) => {
  return (
    <div className="intro-page">
      {/* Top Section - Split Content */}
      <div className="intro-split-section">
        {/* Left Half - Content */}
        <div className="intro-left">
          <div className="intro-content">
            {/* Hero Section */}
            <div className="hero-section">
              <h1 className="hero-title">
               Driver SuperApp Hub - Ride. Earn. Connect.
              </h1>
              <h2 className="hero-subtitle">
                Rides • Community • News • Safety • Earnings
              </h2>
              <p className="hero-description">
                Your all-in-one platform for daily driver operations.
                Manage rides, share updates with other drivers, check transport news,
                track earnings, and access support tools from one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Half - Driver Image */}
        <div className="intro-right">
          <div className="driver-image-container">
            <img 
              src={driverImage} 
              alt="Auto Rickshaw Driver" 
              className="driver-image"
            />
          </div>
        </div>
      </div>

      {/* Full Width Section - Marquee */}
      <div className="intro-full-width">
        {/* Section Heading */}
        <h2 className="section-heading">Driver Network</h2>
        
        {/* Marquee Section */}
        <div className="marquee-container">
          <div>
          <marquee behavior="scroll" direction="left" scrollamount="10">
            <img src="https://i0.wp.com/commonwealthbeacon.org/wp-content/uploads/2015/08/Uber-CC.jpg?fit=640%2C400&ssl=1" alt="uber" className="marquee-image" />
            <img src="https://upload.wikimedia.org/wikipedia/en/e/e7/Rapido-logo.png" alt="ola" className="marquee-image" />
            <img src="https://images.icon-icons.com/836/PNG/512/Instagram_icon-icons.com_66804.png" alt="insta" className="marquee-image" />
            <img src="https://images.icon-icons.com/2402/PNG/512/mercedes_benz_logo_icon_145797.png" alt="x" className="marquee-image" />
            <img src="https://images.icon-icons.com/2864/PNG/512/whatsapp_logo_icon_181734.png" alt="news" className="marquee-image" />
            <img src="https://images.icon-icons.com/729/PNG/512/paytm_icon-icons.com_62731.png" alt="news" className="marquee-image" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMqFxQWIKJIVejJ0UAqV8KJBxdjDfgbDJTg&s"alt="whataspp" className="marquee-image" />
            <img src="https://images.icon-icons.com/3245/PNG/512/google_pay_icon_198149.png" alt="gpay" className="marquee-image" />
            <img src="https://images.icon-icons.com/70/PNG/512/bbc_news_14062.png"alt="gps" className="marquee-image" />
            <img src="https://images.icon-icons.com/122/PNG/96/twitter_socialnetwork_20007.png" alt="rapido" className="marquee-image" />
          </marquee>
          </div>
          <div>
            <marquee behavior="scroll" direction="right" scrollamount="10">
            <img src="https://i0.wp.com/commonwealthbeacon.org/wp-content/uploads/2015/08/Uber-CC.jpg?fit=640%2C400&ssl=1" alt="uber" className="marquee-image" />
            <img src="https://upload.wikimedia.org/wikipedia/en/e/e7/Rapido-logo.png" alt="ola" className="marquee-image" />
            <img src="https://images.icon-icons.com/836/PNG/512/Instagram_icon-icons.com_66804.png" alt="insta" className="marquee-image" />
            <img src="https://images.icon-icons.com/2402/PNG/512/mercedes_benz_logo_icon_145797.png"alt="x" className="marquee-image" />
            <img src="https://images.icon-icons.com/2864/PNG/512/whatsapp_logo_icon_181734.png" alt="news" className="marquee-image" />
            <img src="https://images.icon-icons.com/729/PNG/512/paytm_icon-icons.com_62731.png" alt="news" className="marquee-image" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMqFxQWIKJIVejJ0UAqV8KJBxdjDfgbDJTg&s"alt="whataspp" className="marquee-image" />
            <img src="https://images.icon-icons.com/3245/PNG/512/google_pay_icon_198149.png" alt="gpay" className="marquee-image" />
            <img src="https://images.icon-icons.com/70/PNG/512/bbc_news_14062.png"alt="gps" className="marquee-image" />
            <img src="https://images.icon-icons.com/122/PNG/96/twitter_socialnetwork_20007.png" alt="rapido" className="marquee-image" />
          </marquee>
          </div>
          
        </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚖</div>
              <h3 className="feature-title">Ride Management</h3>
              <p className="feature-desc">Create & manage ride requests efficiently</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Driver Community</h3>
              <p className="feature-desc">Chat and connect with fellow drivers</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Commission Calculator</h3>
              <p className="feature-desc">Auto-calculate your earnings & commissions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📰</div>
              <h3 className="feature-title">Live News Updates</h3>
              <p className="feature-desc">Stay informed with local & national news</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3 className="feature-title">Delivery Mode</h3>
              <p className="feature-desc">Switch between rides & delivery services</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🆘</div>
              <h3 className="feature-title">SOS & Safety</h3>
              <p className="feature-desc">Emergency support & safety features</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Earnings Summary</h3>
              <p className="feature-desc">Track daily, weekly & monthly income</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3 className="feature-title">Auto Confirmation</h3>
              <p className="feature-desc">Ride confirmation with balance tracking</p>
            </div>
          </div>

        {/* CTA Button */}
        <div className="cta-section">
          <button className="cta-button" onClick={onEnter}>
            Enter Driver App
            <span className="button-arrow">→</span>
          </button>
        </div>

        {/* Footer Contact Section */}
        <div className="intro-footer">
          <div className="footer-contact">
            <h3 className="footer-heading">Get in Touch</h3>
            <div className="footer-content">
              <div className="footer-column">
                <h4>Contact Us</h4>
                <p>📧 support@driversuperapp.in</p>
                <p>📞 +91 98765 43210</p>
                <p>🏢 Patiala, Punjab - 147001</p>
              </div>
              <div className="footer-column">
                <h4>Quick Links</h4>
                <p>• About Us</p>
                <p>• Terms & Conditions</p>
                <p>• Privacy Policy</p>
                <p>• FAQs</p>
              </div>
              <div className="footer-column">
                <h4>Follow Us</h4>
                <p>📱 Instagram</p>
                <p>🐦 Twitter/X</p>
                <p>📘 Facebook</p>
                <p>▶️ YouTube</p>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <p>• Help Center</p>
                <p>• Driver Support</p>
                <p>• Report Issue</p>
                <p>• Feedback</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>🇮🇳 Made in India for Indian Drivers | © 2025 Driver SuperApp. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
