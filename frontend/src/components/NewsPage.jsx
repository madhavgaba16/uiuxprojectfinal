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
    { id: 4, category: 'fuel', title: 'Petrol Price Drops by Rs 2.50 in Patiala', excerpt: 'Petrol now at Rs 96.40/liter in Patiala. Diesel prices remain stable at Rs 89.20/liter. Next revision expected on Nov 25.', source: 'NDTV', time: '1 hour ago', channel: 'NDTV Profit', link: 'https://www.ndtv.com/business/petrol-price-today' },
    { id: 5, category: 'fuel', title: 'CNG Prices to Increase Next Month', excerpt: 'CNG prices expected to rise by Rs 3-4 per kg in Punjab. Government considers subsidy for auto-rickshaw drivers.', source: 'Hindustan Times', time: '4 hours ago', channel: 'HT Auto', link: 'https://www.hindustantimes.com/auto' },
    { id: 6, category: 'fuel', title: 'Electric Vehicle Charging Stations in Patiala', excerpt: '5 new EV charging stations to be installed at major petrol pumps across Patiala by December. Fast charging facility available.', source: 'The Tribune', time: '6 hours ago', channel: 'Tribune Punjab', link: 'https://www.tribuneindia.com/news/punjab' },

    // Weather Alerts
    { id: 7, category: 'weather', title: 'Heavy Fog Alert for Next 3 Days', excerpt: 'IMD issues warning for dense fog in Punjab. Visibility expected to drop below 50 meters. Drive carefully during early morning hours.', source: 'Weather Channel', time: '30 minutes ago', channel: 'Weather India', link: 'https://weather.com/en-IN/india/punjab/patiala' },
    { id: 8, category: 'weather', title: 'Winter Rain Expected This Weekend', excerpt: 'Light to moderate rainfall predicted on Saturday and Sunday. Temperature may drop to 8 C. Plan your trips accordingly.', source: 'Skymet', time: '3 hours ago', channel: 'Skymet Weather', link: 'https://www.skymetweather.com/content/weather-news-and-analysis/' },
    { id: 9, category: 'weather', title: 'Air Quality Deteriorates in Patiala', excerpt: 'AQI reaches 250 (Poor category). Authorities advise limiting outdoor activities. Vehicle pollution main contributor.', source: 'NDTV', time: '7 hours ago', channel: 'NDTV India', link: 'https://www.ndtv.com/india-news' },

    // General Transport News
    { id: 10, category: 'general', title: 'Punjab Roadways Introduces New Bus Service', excerpt: 'New Patiala-Amritsar express service launched. AC buses with GPS tracking and online booking facility available.', source: 'Indian Express', time: '4 hours ago', channel: 'IE Punjab', link: 'https://indianexpress.com/section/cities/chandigarh/' },
    { id: 11, category: 'general', title: 'Car Insurance Premiums to Increase by 15%', excerpt: 'Insurance companies announce premium hike from January 2026. Third-party insurance rates revised by IRDAI.', source: 'Economic Times', time: '9 hours ago', channel: 'ET Auto', link: 'https://auto.economictimes.indiatimes.com/' },
    { id: 12, category: 'general', title: 'Parking Fees Revised in Patiala Municipal Area', excerpt: 'New parking charges: Rs 20 for cars, Rs 10 for bikes. Monthly passes available at Mall Road and Bus Stand parking lots.', source: 'Dainik Jagran', time: '12 hours ago', channel: 'DJ Punjab', link: 'https://www.jagran.com/punjab/' },
  ];

  const getFilteredNews = () => {
    if (activeTab === 'all') {
      return newsData;
    }
    return newsData.filter(news => news.category === activeTab || (activeTab === 'traffic' && news.category === 'general'));
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'fuel': return 'Fuel Price';
      case 'traffic': return 'Traffic Rules';
      case 'weather': return 'Weather';
      case 'general': return 'General';
      default: return category;
    }
  };

  const tabs = [
    { key: 'all', label: 'All News' },
    { key: 'fuel', label: 'Fuel Prices' },
    { key: 'traffic', label: 'Traffic Rules' },
    { key: 'weather', label: 'Weather' },
  ];

  const categoryCards = [
    { key: 'fuel', name: 'Fuel Updates', desc: 'Daily price changes' },
    { key: 'traffic', name: 'Traffic Rules', desc: 'New regulations' },
    { key: 'weather', name: 'Weather Alerts', desc: 'Live forecasts' },
    { key: 'general', name: 'General News', desc: 'Transportation updates' },
    { key: 'all', name: 'All News', desc: 'Complete updates' },
  ];

  return (
    <div className="news-page">
      <div className="page-container news-container-wide">
        <div className="page-header">
          <h1 className="page-title">News and Alerts</h1>
          <p className="page-subtitle">Stay updated with latest transportation news</p>
        </div>

        {/* Tab bar */}
        <div className="news-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`news-tab-btn ${activeTab === tab.key ? 'news-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* News grid */}
        <section className="news-section">
          <h2 className="news-section-title">Latest Updates</h2>
          <div className="news-grid">
            {getFilteredNews().map((news) => (
              <div key={news.id} className="card news-card">
                <span className={`badge news-badge--${news.category}`}>
                  {getCategoryLabel(news.category)}
                </span>
                <h3 className="news-card__title">{news.title}</h3>
                <p className="news-card__excerpt">{news.excerpt}</p>
                <div className="news-card__meta">
                  <span className="news-card__source">{news.channel}</span>
                  <span className="news-card__time">{news.time}</span>
                </div>
                <button
                  className="btn-secondary news-card__read-btn"
                  onClick={() => window.open(news.link, '_blank')}
                >
                  Read Full Article
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Alerts */}
        <section className="news-section">
          <h2 className="news-section-title">Quick Alerts</h2>
          <div className="news-alerts-grid">
            <div className="card news-alert-card news-alert-card--fuel">
              <span className="news-alert-label">Fuel Prices</span>
              <h4 className="news-alert-heading">Fuel Prices Today</h4>
              <div className="news-fuel-list">
                <div className="news-fuel-row">
                  <span>Petrol</span>
                  <span className="news-fuel-price">Rs 102.50/L</span>
                </div>
                <div className="news-fuel-row">
                  <span>Diesel</span>
                  <span className="news-fuel-price">Rs 89.30/L</span>
                </div>
              </div>
              <small className="news-alert-location">Patiala, Punjab</small>
            </div>

            <div className="card news-alert-card news-alert-card--weather">
              <span className="news-alert-label">Weather</span>
              <h4 className="news-alert-heading">Weather Update</h4>
              <p className="news-alert-text">Partly cloudy with chance of rain in evening</p>
              <div className="news-alert-detail">24 C - 32 C</div>
            </div>

            <div className="card news-alert-card news-alert-card--traffic">
              <span className="news-alert-label">Traffic</span>
              <h4 className="news-alert-heading">Traffic Notice</h4>
              <p className="news-alert-text">Road construction near Civil Lines. Expect delays.</p>
              <small className="news-alert-location">Valid till: Nov 25, 2025</small>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="news-section">
          <h2 className="news-section-title">Browse by Category</h2>
          <div className="news-categories-grid">
            {categoryCards.map((cat) => (
              <div
                key={cat.key}
                className={`card news-category-card ${activeTab === cat.key ? 'news-category-card--active' : ''}`}
                onClick={() => setActiveTab(cat.key)}
              >
                <h4 className="news-category-card__name">{cat.name}</h4>
                <p className="news-category-card__desc">{cat.desc}</p>
                <span className="badge news-category-card__count">
                  {cat.key === 'all'
                    ? newsData.length
                    : newsData.filter(n => n.category === cat.key).length} articles
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsPage;
