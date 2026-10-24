import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiArrowRight,
  FiCoffee,
} from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { state } = useApp();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/menu', label: 'Menu' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar-pill">
          {/* BRAND LOGO */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-badge">
              <FiCoffee className="brand-icon" />
            </div>
            <div className="brand-text-col">
              <span className="brand-title">Rathory</span>
              <span className="brand-subtitle">Chai</span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="navbar-center-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span>{link.label}</span>
                {location.pathname === link.path && <div className="active-dot" />}
              </Link>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="navbar-actions">
            {/* Quick Search Link to Menu */}
            <Link to="/menu" className="nav-icon-action" title="Search Menu">
              <FiSearch />
            </Link>

            {/* Light / Dark / System Animated Toggle */}
            <ThemeToggle />

            {/* Shopping Cart Pill */}
            <Link to="/cart" className="nav-icon-action cart-action-btn" title="Your Cart">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge-counter">{cartCount}</span>}
            </Link>

            {/* User / Profile Link */}
            <Link
              to={state.isAuthenticated ? '/profile' : '/login'}
              className="nav-icon-action"
              title={state.isAuthenticated ? 'My Dashboard' : 'Sign In'}
            >
              <FiUser />
            </Link>

            {/* CTA Gradient Button */}
            <Link to="/menu" className="btn btn-primary btn-sm nav-cta-btn">
              <span>Order Now</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-toggle-btn"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-header">
              <span className="brand-title">Rathory Chai Wale</span>
              <button onClick={() => setMenuOpen(false)} className="drawer-close-btn">
                <FiX />
              </button>
            </div>
            <div className="mobile-links-list">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mobile-drawer-actions">
                <Link to="/menu" className="btn btn-primary" style={{ width: '100%' }}>
                  Order Now <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
