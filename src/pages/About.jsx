import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { timelineEvents, teamMembers } from '../data/appData';
import { FiCheckCircle, FiHeart, FiAward, FiSun, FiArrowRight } from 'react-icons/fi';
import './About.css';

export default function About() {
  const [selectedSpice, setSelectedSpice] = useState(0);

  const spices = [
    {
      name: 'Chhoti Elaichi (Green Cardamom)',
      origin: 'Idukki Hills, Kerala',
      benefit: 'Natural digestive, aromatic queen of Indian spices',
      desc: 'Crushed freshly seconds before entering the boiling kettle to release delicate volatile essential oils.',
      color: '#4A7C38'
    },
    {
      name: 'Kashmiri Kesar (Pure Saffron)',
      origin: 'Pampore, Kashmir',
      benefit: 'Immunity booster, gives signature majestic royal golden hue',
      desc: 'Steeped gently in warm whole milk to unveil subtle floral sweetness and legendary royal aroma.',
      color: '#D4AF50'
    },
    {
      name: 'Taaza Adrak (Ginger Root)',
      origin: 'Wayanad, Kerala',
      benefit: 'Anti-inflammatory warmth, cures throat irritation & lethargy',
      desc: 'Hand-pounded fresh to deliver the unmistakable zesty punch that chai enthusiasts crave.',
      color: '#B87333'
    },
    {
      name: 'Dalchini (Ceylon Cinnamon)',
      origin: 'Southern Ghats',
      benefit: 'Balances sweetness naturally without excessive sugar',
      desc: 'Slowly infused in simmering water, lending deep woodsy warmth to our signature masala base.',
      color: '#8B4513'
    },
    {
      name: 'Laung (Organic Cloves)',
      origin: 'Tamil Nadu Orchards',
      benefit: 'Antioxidant powerhouse, comforting throat soothing agent',
      desc: 'Carefully measured to provide spicy undertones without overpowering the delicate tea liquor.',
      color: '#5C2E0A'
    }
  ];

  return (
    <div className="about-page">
      {/* 1. HERO */}
      <section className="about-hero">
        <div className="container">
          <span className="section-subtitle">A Tradition Steeped in Devotion</span>
          <h1 className="section-title">The Rathory Heritage</h1>
          <div className="gold-line"></div>
          <p className="section-desc">
            From an unpretentious roadside kettle to Rajasthan's most iconic luxury artisanal chai house.
          </p>
        </div>
      </section>

      {/* 2. THE STORY */}
      <section className="section story-section">
        <div className="container story-grid">
          <div className="story-content">
            <span className="section-subtitle">Since 2019</span>
            <h2>Where Clay Meets The King of Teas</h2>
            <p>
              In Jaipur, tea is not merely a beverage — it is a ceremonial bridge of human connection,
              morning vitality, and heartwarming hospitality. Rathory Chai Wale was conceived by Rathore Ji
              with an unwavering conviction: the true essence of Indian chai had been compromised by modern
              artificial syrups and shortcuts.
            </p>
            <p>
              He set out to restore the ancient ritual: slow simmering over low flame, pounding raw spices
              by hand in stone mortars, selecting whole-leaf Assam tea, and serving solely in biodegradable
              baked terracotta kulhads that honor Mother Earth and local pottery artisans.
            </p>

            <div className="story-highlights">
              <div className="story-hl-item">
                <FiAward className="hl-icon" />
                <div>
                  <strong>No Powders or Concentrates</strong>
                  <p>100% natural, hand-crushed raw spices in every kettle.</p>
                </div>
              </div>
              <div className="story-hl-item">
                <FiSun className="hl-icon" />
                <div>
                  <strong>Slow Flame Brewing</strong>
                  <p>Brewed patiently to extract rich oils and balanced body.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="story-image-wrap">
            <img src="/images/kulhad-chai.jpg" alt="Rathory clay kulhad chai" className="story-img" />
            <div className="story-badge">
              <span>Authentic Kulhad Tradition</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECRET SPICES INTERACTIVE EXPLORER */}
      <section className="section spices-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Aromatic Alchemy</span>
            <h2 className="section-title">The Secret Spices of Rathory</h2>
            <div className="gold-line"></div>
            <p className="section-desc">
              Click each spice to learn how we source and craft our distinct, uncompromised flavor profile.
            </p>
          </div>

          <div className="spices-explorer">
            <div className="spices-nav">
              {spices.map((spice, idx) => (
                <button
                  key={spice.name}
                  onClick={() => setSelectedSpice(idx)}
                  className={`spice-tab-btn ${selectedSpice === idx ? 'active' : ''}`}
                >
                  <span className="spice-dot" style={{ background: spice.color }}></span>
                  <span>{spice.name}</span>
                </button>
              ))}
            </div>

            <div className="spice-detail-card">
              <div className="spice-detail-header">
                <div>
                  <h3>{spices[selectedSpice].name}</h3>
                  <span className="spice-origin">Sourced from: {spices[selectedSpice].origin}</span>
                </div>
                <div className="spice-icon-large">🌿</div>
              </div>

              <div className="spice-detail-body">
                <div className="spice-info-block">
                  <strong>Wellness Blessing:</strong>
                  <p>{spices[selectedSpice].benefit}</p>
                </div>
                <div className="spice-info-block">
                  <strong>The Master's Brewing Method:</strong>
                  <p>{spices[selectedSpice].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="section timeline-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Journey</span>
            <h2 className="section-title">Milestones of Passion</h2>
            <div className="gold-line"></div>
          </div>

          <div className="timeline-wrapper">
            {timelineEvents.map((event, idx) => (
              <div key={event.year} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-node">
                  <span className="timeline-year">{event.year}</span>
                </div>
                <div className="timeline-card">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM / ARTISANS */}
      <section className="section team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Meet The Custodians</span>
            <h2 className="section-title">Our Master Tea Artisans</h2>
            <div className="gold-line"></div>
          </div>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h4 className="team-name">{member.name}</h4>
                <span className="team-role">{member.role}</span>
                <p className="team-desc">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-box">
            <div className="cta-banner-content">
              <h2>Taste The Tradition Yourself</h2>
              <p>Experience the royal brewing craft in person or order fresh to your table.</p>
              <div className="cta-btn-row">
                <Link to="/menu" className="btn btn-primary">
                  Order A Fresh Brew
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Find Cafe Location
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
