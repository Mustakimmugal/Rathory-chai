import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiSend,
  FiCoffee,
  FiShield,
} from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Subscribed! Welcome to Rathory Chai Lounge Club ✨', 'success');
    setEmail('');
  };

  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* BRAND COLUMN */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-logo">
              <div className="brand-icon-box">
                <FiCoffee />
              </div>
              <div className="brand-text">
                <span className="brand-name">Rathory</span>
                <span className="brand-sub">Chai Wale</span>
              </div>
            </Link>

            <p className="footer-tagline">
              Har Cup Mein Ek Kahani. Crafted with artisanal whole spices, premium estate tea leaves, and contemporary cafe elegance.
            </p>

            <div className="footer-social-links">
              <a href="#instagram" aria-label="Instagram" className="footer-social-btn">
                <FiInstagram />
              </a>
              <a href="#facebook" aria-label="Facebook" className="footer-social-btn">
                <FiFacebook />
              </a>
              <a href="#twitter" aria-label="Twitter" className="footer-social-btn">
                <FiTwitter />
              </a>
              <a href="#youtube" aria-label="YouTube" className="footer-social-btn">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* OUR SERVICES */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Our Services</h4>
            <ul className="footer-nav-list">
              <li><Link to="/services">Dine In Lounge</Link></li>
              <li><Link to="/menu">Takeaway Counter</Link></li>
              <li><Link to="/cart">Home Delivery</Link></li>
              <li><Link to="/services">Event Catering</Link></li>
              <li><Link to="/services">Corporate Orders</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="footer-nav-col newsletter-col">
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="newsletter-desc">Get latest updates, seasonal blends & VIP offers.</p>

            <form onSubmit={handleSubscribe} className="footer-newsletter-box">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-email-input"
              />
              <button type="submit" className="footer-submit-btn" aria-label="Subscribe">
                <FiSend />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} Rathory Chai Wale. All rights reserved.
          </p>

          <div className="footer-right-meta">
            <Link to="/admin" className="admin-portal-link">
              <FiShield /> Admin Portal
            </Link>
            <span className="dot">•</span>
            <a href="#privacy">Privacy</a>
            <span className="dot">•</span>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
