import React, { useState } from 'react';
import './NewsPage.css';

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const newsData = [
    // Traffic & Road News
    { id: 1, category: 'traffic', title: 'New Traffic Rules Implemented from December 2025', excerpt: 'Ministry of Road Transport announces stricter penalties for overspeeding and drunk driving. Fine amounts increased by 50% across all categories.', source: 'India Today', time: '2 hours ago', channel: 'India Today', link: 'https://www.indiatoday.in/auto/latest-auto-news' },
    { id: 2, category: 'traffic', title: 'FASTag Mandatory for All Vehicles from January 2026', excerpt: 'Government makes FASTag compulsory for all four-wheelers. Non-compliance will result in double toll charges at highways.', source: 'Times of India', time: '5 hours ago', channel: 'TOI Auto', link: 'https://timesofindia.indiatimes.com/auto/news' },
    { id: 3, category: 'traffic', title: 'Patiala-Chandigarh Highway Speed Limit Reduced', excerpt: 'Speed limit reduced from 100 km/h to 80 km/h on NH-64 due to ongoing construction work near Rajpura bypass.', source: 'Punjab Kesari', time: '8 hours ago', channel: 'Punjab News', link: 'https://www.punjabkesari.in/punjab/news' },
    
    // Fuel Price News
    { id: 4, category: 'fuel', title: 'Petrol Price Drops by ₹2.50 in Patiala', excerpt: 'Petrol now at ₹96.40/liter in Patiala. Diesel prices remain stable at ₹89.20/liter. Next revision expected on Nov 25.', source: 'NDTV', time: '1 hour ago', channel: 'NDTV Profit', link: 'https://www.ndtv.com/business/petrol-price-today' },
    { id: 5, category: 'fuel', title: 'CNG Prices to Increase Next Month', excerpt: 'CNG prices expected to rise by ₹3-4 per kg in Punjab. Government considers subsidy for auto-rickshaw drivers.', source: 'Hindustan Times', time: '4 hours ago', channel: 'HT Auto', link: 'https://www.hindustantimes.com/auto' },
    { id: 6, category: 'fuel', title: 'Electric Vehicle Charging Stations in Patiala', excerpt: '5 new EV charging stations to be installed at major petrol pumps across Patiala by December. Fast charging facility available.', source: 'The Tribune', time: '6 hours ago', channel: 'Tribune Punjab', link: 'https://www.tribuneindia.com/news/punjab' },
    
    // Weather Alerts
    { id: 7, category: 'weather', title: 'Heavy Fog Alert for Next 3 Days', excerpt: 'IMD issues warning for dense fog in Punjab. Visibility expected to drop below 50 meters. Drive carefully during early morning hours.', source: 'Weather Channel', time: '30 minutes ago', channel: 'Weather India', link: 'https://weather.com/en-IN/india/punjab/patiala' },
    { id: 8, category: 'weather', title: 'Winter Rain Expected This Weekend', excerpt: 'Light to moderate rainfall predicted on Saturday and Sunday. Temperature may drop to 8°C. Plan your trips accordingly.', source: 'Skymet', time: '3 hours ago', channel: 'Skymet Weather', link: 'https://www.skymetweather.com/content/weather-news-and-analysis/' },
    { id: 9, category: 'weather', title: 'Air Quality Deteriorates in Patiala', excerpt: 'AQI reaches 250 (Poor category). Authorities advise limiting outdoor activities. Vehicle pollution main contributor.', source: 'NDTV', time: '7 hours ago', channel: 'NDTV India', link: 'https://www.ndtv.com/india-news' },
    
    // General Transport News
    { id: 10, category: 'general', title: 'Punjab Roadways Introduces New Bus Service', excerpt: 'New Patiala-Amritsar express service launched. AC buses with GPS tracking and online booking facility available.', source: 'Indian Express', time: '4 hours ago', channel: 'IE Punjab', link: 'https://indianexpress.com/section/cities/chandigarh/' },
    { id: 11, category: 'general', title: 'Car Insurance Premiums to Increase by 15%', excerpt: 'Insurance companies announce premium hike from January 2026. Third-party insurance rates revised by IRDAI.', source: 'Economic Times', time: '9 hours ago', channel: 'ET Auto', link: 'https://auto.economictimes.indiatimes.com/' },
    { id: 12, category: 'general', title: 'Parking Fees Revised in Patiala Municipal Area', excerpt: 'New parking charges: ₹20 for cars, ₹10 for bikes. Monthly passes available at Mall Road and Bus Stand parking lots.', source: 'Dainik Jagran', time: '12 hours ago', channel: 'DJ Punjab', link: 'https://www.jagran.com/punjab/' },
  ];

  const getFilteredNews = () => {
    if (activeTab === 'all') {
      return newsData;
    }
    return newsData.filter(news => news.category === activeTab || (activeTab === 'traffic' && news.category === 'general'));
  };

  return (
    <div className="news-page">
      <div className="news-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📰 News & Alerts</h1>
            <p className="subtitle">Stay updated with latest transportation news</p>
          </div>
          <div className="news-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All News
            </button>
            <button 
              className={`tab-btn ${activeTab === 'fuel' ? 'active' : ''}`}
              onClick={() => setActiveTab('fuel')}
            >
              Fuel Prices
            </button>
            <button 
              className={`tab-btn ${activeTab === 'traffic' ? 'active' : ''}`}
              onClick={() => setActiveTab('traffic')}
            >
              Traffic Rules
            </button>
            <button 
              className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
              onClick={() => setActiveTab('weather')}
            >
              Weather
            </button>
          </div>
        </div>
      </div>

      <div className="news-container">
        <div className="news-grid">
          {/* Web Scraping Placeholder Section */}
          

          {/* News Articles Grid */}
          <div className="news-articles-section">
            <div className="section-header">
              <h2>Latest Updates</h2>

            </div>

            <div className="news-articles-grid">
              {getFilteredNews().map((news) => (
                <div key={news.id} className="news-card">
                  <div className={`news-badge ${news.category}`}>
                    {news.category === 'fuel' && '⛽ Fuel Price'}
                    {news.category === 'traffic' && '🚦 Traffic Rules'}
                    {news.category === 'weather' && '🌤️ Weather'}
                    {news.category === 'general' && '📰 General'}
                  </div>
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-excerpt">{news.excerpt}</p>
                  <div className="news-meta">
                    <span className="news-source">
                      <span className="source-icon"></span>
                      {news.channel}
                    </span>
                    <span className="news-time">
                      <span className="time-icon"></span>
                      {news.time}
                    </span>
                  </div>
                  <button 
                    className="read-more-btn"
                    onClick={() => window.open(news.link, '_blank')}
                  >
                    Read Full Article →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Alert Cards */}
        <div className="quick-alerts">
          <h2 className="alerts-title">⚡ Quick Alerts</h2>
          <div className="alert-cards">
            <div className="alert-card fuel-alert">
              <div className="alert-icon">⛽</div>
              <div className="alert-content">
                <h4>Fuel Prices Today</h4>
                <div className="fuel-prices">
                  <div className="fuel-item">
                    <span>Petrol</span>
                    <span className="price">₹102.50/L</span>
                  </div>
                  <div className="fuel-item">
                    <span>Diesel</span>
                    <span className="price">₹89.30/L</span>
                  </div>
                </div>
                <small>📍 Patiala, Punjab</small>
              </div>
            </div>

            <div className="alert-card weather-alert">
              <div className="alert-icon">🌤️</div>
              <div className="alert-content">
                <h4>Weather Update</h4>
                <p>Partly cloudy with chance of rain in evening</p>
                <div className="temp-range">
                  <span>🌡️ 24°C - 32°C</span>
                </div>
              </div>
            </div>

            <div className="alert-card traffic-alert">
              <div className="alert-icon">🚦</div>
              <div className="alert-content">
                <h4>Traffic Notice</h4>
                <p>Road construction near Civil Lines. Expect delays.</p>
                <small>Valid till: Nov 25, 2025</small>
              </div>
            </div>
          </div>
        </div>

        {/* News Categories Grid */}
        <div className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            <div 
              className={`category-card ${activeTab === 'fuel' ? 'active' : ''}`}
              onClick={() => setActiveTab('fuel')}
            >
              <span className="category-icon">⛽</span>
              <h4>Fuel Updates</h4>
              <p>Daily price changes</p>
              <span className="news-count">{newsData.filter(n => n.category === 'fuel').length} articles</span>
            </div>
            <div 
              className={`category-card ${activeTab === 'traffic' ? 'active' : ''}`}
              onClick={() => setActiveTab('traffic')}
            >
              <span className="category-icon">🚦</span>
              <h4>Traffic Rules</h4>
              <p>New regulations</p>
              <span className="news-count">{newsData.filter(n => n.category === 'traffic').length} articles</span>
            </div>
            <div 
              className={`category-card ${activeTab === 'weather' ? 'active' : ''}`}
              onClick={() => setActiveTab('weather')}
            >
              <span className="category-icon">🌤️</span>
              <h4>Weather Alerts</h4>
              <p>Live forecasts</p>
              <span className="news-count">{newsData.filter(n => n.category === 'weather').length} articles</span>
            </div>
            <div 
              className={`category-card ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span className="category-icon">📰</span>
              <h4>General News</h4>
              <p>Transportation updates</p>
              <span className="news-count">{newsData.filter(n => n.category === 'general').length} articles</span>
            </div>
            <div 
              className={`category-card ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <span className="category-icon">🌐</span>
              <h4>All News</h4>
              <p>Complete updates</p>
              <span className="news-count">{newsData.length} articles</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
