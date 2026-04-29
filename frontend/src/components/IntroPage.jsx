import React from 'react';
import './IntroPage.css';

const features = [
  {
    title: 'Ride Management',
    desc: 'Create and manage ride requests efficiently from one dashboard.',
  },
  {
    title: 'Driver Community',
    desc: 'Chat and connect with fellow drivers in real time.',
  },
  {
    title: 'Commission Calculator',
    desc: 'Auto-calculate your earnings and platform commissions.',
  },
  {
    title: 'Live News Updates',
    desc: 'Stay informed with local and national transport news.',
  },
  {
    title: 'Delivery Mode',
    desc: 'Switch seamlessly between ride and delivery services.',
  },
  {
    title: 'SOS and Safety',
    desc: 'Emergency support and real-time safety features.',
  },
  {
    title: 'Earnings Summary',
    desc: 'Track daily, weekly, and monthly income at a glance.',
  },
  {
    title: 'Auto Confirmation',
    desc: 'Instant ride confirmation with live balance tracking.',
  },
];

const IntroPage = ({ onEnter }) => {
  return (
    <div className="intro-page">
      {/* Hero */}
      <section className="intro-hero">
        <h1 className="intro-hero-title">WheelWise</h1>
        <p className="intro-hero-tagline">Ride. Earn. Connect.</p>
        <p className="intro-hero-desc">
          Your all-in-one platform for daily driver operations. Manage rides,
          share updates with other drivers, check transport news, track
          earnings, and access support tools — all from one place.
        </p>
        <button className="btn-primary intro-cta" onClick={onEnter}>
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="intro-features">
        <h2 className="intro-section-title">What you get</h2>
        <div className="intro-features-grid">
          {features.map((f) => (
            <div className="card intro-feature-card" key={f.title}>
              <h3 className="intro-feature-title">{f.title}</h3>
              <p className="intro-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="intro-footer">
        <div className="intro-footer-grid">
          <div className="intro-footer-col">
            <h4 className="intro-footer-heading">Contact</h4>
            <p>support@wheelwise.in</p>
            <p>+91 98765 43210</p>
            <p>Patiala, Punjab 147001</p>
          </div>
          <div className="intro-footer-col">
            <h4 className="intro-footer-heading">Links</h4>
            <p>About Us</p>
            <p>Terms and Conditions</p>
            <p>Privacy Policy</p>
            <p>FAQs</p>
          </div>
          <div className="intro-footer-col">
            <h4 className="intro-footer-heading">Support</h4>
            <p>Help Center</p>
            <p>Driver Support</p>
            <p>Report Issue</p>
            <p>Feedback</p>
          </div>
        </div>
        <div className="intro-footer-bottom">
          <p>WheelWise 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IntroPage;
