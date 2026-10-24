import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import GoogleMapSection from '../components/GoogleMapSection';
import {
  FiArrowRight,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiStar,
  FiSend,
} from 'react-icons/fi';
import './Home.css';

export default function Home() {
  const { state, addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickContact, setQuickContact] = useState({ name: '', email: '', message: '' });

  const popularCategories = [
    { id: 'all', label: 'All' },
    { id: 'chai', label: 'Chai' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'burger', label: 'Burger' },
    { id: 'juices', label: 'Juices' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const popularProducts = state.products
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .slice(0, 6);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!quickContact.name) {
      addToast('Please enter your name', 'error');
      return;
    }
    addToast('Thank you! Our concierge will connect with you soon ☕', 'success');
    setQuickContact({ name: '', email: '', message: '' });
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);

  // Continuous video loop assurance & visibility handling
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start video safely (muted autoplay policy)
    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          video.muted = true;
          video.play().catch(() => { });
        });
      }
    };

    playVideo();

    // Loop fallback to guarantee it never stops
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => { });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        video.play().catch(() => { });
      }
    };

    video.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    if (video.paused && isPlaying) {
      video.play().catch(() => { });
    }
  };

  return (
    <div className="modern-home-page">
      {/* =========================================================
          1. HERO SECTION - CINEMATIC ANIMATED VIDEO BACKGROUND & FRAMER MOTION
          ========================================================= */}
      <section className="modern-hero-section cinematic-video-hero">
        {/* BACKGROUND VIDEO WITH INFINITE LOOP */}
        <div className="hero-video-background-wrap">
          <video
            ref={videoRef}
            className="hero-background-video"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
          >
            <source src="/Creating_cafe_animated_backgroun…_1080p_20261022215257.mp4" type="video/mp4" />
            <source src="/cafe_hero_video.mp4" type="video/mp4" />
          </video>
          {/* Dual Overlay: Dark ambient vignette & bottom seamless fade */}
          <div className="hero-video-overlay-gradient" />
          <div className="hero-video-vignette" />
        </div>


        <div className="container hero-text-only-container">
          {/* LEFT: BRAND TEXT ONLY WITH DYNAMIC ANIMATIONS & RICH COLORS */}
          <div className="hero-content-col hero-text-animated-wrapper">
            {/* GRAND HEADLINE */}
            <h1 className="hero-main-title hero-video-title">
              <span className="hero-eyebrow animated-eyebrow">
                <span className="eyebrow-sparkle">✨</span> Taste The Royal Heritage
              </span>
              <br />
              <span className="gradient-brand-word glow-text animated-brand-shimmer">
                Rathory Chai
              </span>
            </h1>

            {/* POETIC SUBTITLE & TAGLINE WITH MULTI-COLOR ACCENTS & ANIMATION */}
            <p className="hero-sub-tagline hero-hindi-quote animated-quote">
              “<span className="quote-word-story">Har Cup Mein Ek Kahani</span>,{' '}
              <span className="quote-word-freshness">Har Ghoont Mein Tazgi</span>.”{' '}
              <span className="quote-cup-emoji">☕</span>
            </p>

            <p className="hero-desc-lead animated-lead">
              Experience the aroma of freshly <span className="highlight-spices">hand-crushed spices</span>,{' '}
              slow-simmered rich tea leaves, and cozy cafe vibes. Freshly brewed in authentic{' '}
              <span className="highlight-kulhad">earthen kulhad</span>.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. POPULAR MENU SECTION (MATCHING REFERENCE IMAGE)
          ========================================================= */}
      <section className="section popular-menu-section">
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2 className="section-title">Popular Menu</h2>
              <p className="section-desc">Our best selling items, loved by customers</p>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* CATEGORY TABS */}
          <div className="category-tabs-container">
            {popularCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`menu-pill-tab ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* PRODUCTS GRID */}
          <div className="products-grid-modern">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          3. FOUR-COLUMN EXPERIENCE GRID (MATCHING REFERENCE IMAGE)
          - Our Gallery
          - Why Choose Rathory?
          - Visit Our Cafe
          - Get In Touch
          ========================================================= */}
      <section className="section experience-quad-section">
        <div className="container quad-grid">
          {/* CARD 1: OUR GALLERY */}
          <div className="quad-card glass-card gallery-preview-card">
            <div className="quad-card-head">
              <div>
                <h3>Our Gallery</h3>
                <p>Moments, memories and great food</p>
              </div>
              <Link to="/gallery" className="quad-link">
                View Gallery ➔
              </Link>
            </div>
            <div className="quad-gallery-collage">
              <img src="/images/hero-bg.jpg" alt="Cafe lounge" className="quad-img q-img-1" />
              <img src="/images/masala-chai.jpg" alt="Masala chai" className="quad-img q-img-2" />
              <img src="/images/kulhad-chai.jpg" alt="Kulhad chai" className="quad-img q-img-3" />
            </div>
          </div>

          {/* CARD 2: WHY CHOOSE RATHORY (DARK LUXURY CARD) */}
          <div className="quad-card dark-feature-card">
            <h3 className="why-title">Why Choose Rathory?</h3>
            <div className="why-benefits-list">
              <div className="why-benefit-item">
                <div className="why-icon">👑</div>
                <div>
                  <strong>Premium Quality</strong>
                  <p>Hand-selected single-origin leaves & spices</p>
                </div>
              </div>

              <div className="why-benefit-item">
                <div className="why-icon">✨</div>
                <div>
                  <strong>Great Taste</strong>
                  <p>Authentic heritage family recipes</p>
                </div>
              </div>

              <div className="why-benefit-item">
                <div className="why-icon">☕</div>
                <div>
                  <strong>Cozy Ambience</strong>
                  <p>Designed for tranquility & connection</p>
                </div>
              </div>

              <div className="why-benefit-item">
                <div className="why-icon">🏷️</div>
                <div>
                  <strong>Affordable Prices</strong>
                  <p>More taste, honest cost</p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: GET IN TOUCH */}
          <div className="quad-card glass-card contact-form-card">
            <div className="quad-card-head">
              <div>
                <h3>Get In Touch</h3>
                <p>Drop a quick line or table reservation</p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="quick-form-stack">
              <input
                type="text"
                placeholder="Name"
                required
                value={quickContact.name}
                onChange={(e) => setQuickContact({ ...quickContact, name: e.target.value })}
                className="quick-input"
              />
              <input
                type="email"
                placeholder="Email or Mobile"
                required
                value={quickContact.email}
                onChange={(e) => setQuickContact({ ...quickContact, email: e.target.value })}
                className="quick-input"
              />
              <textarea
                placeholder="Message or Reservation note..."
                rows="2"
                value={quickContact.message}
                onChange={(e) => setQuickContact({ ...quickContact, message: e.target.value })}
                className="quick-input"
              />
              <button type="submit" className="btn btn-gradient btn-sm send-msg-btn">
                <span>Send Message</span>
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. CUSTOMER TESTIMONIALS (100% FULL WIDTH)
          ========================================================= */}
      <section className="section reviews-section full-width-reviews">
        <div className="reviews-full-container">
          <div className="section-header">
            <span className="section-subtitle">Loved By Thousands</span>
            <h2 className="section-title">What Our Patrons Say</h2>
            <p className="section-desc">Experience why thousands visit us daily across tea, coffee, and comfort delicacies.</p>
          </div>

          <div className="reviews-grid">
            {state.testimonials?.map((t) => (
              <div key={t.id} className="review-card glass-card">
                <div className="review-stars-row">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="star-gold" />
                  ))}
                </div>
                <p className="review-quote">"{t.text}"</p>
                <div className="reviewer-meta">
                  <div className="reviewer-avatar">{t.avatar || '👑'}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. GOOGLE MAP SECTION (SEB KE NICHE FULL COMPONENT)
          ========================================================= */}
      <GoogleMapSection />
    </div>
  );
}
