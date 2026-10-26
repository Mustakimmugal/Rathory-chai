import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiGrid,
  FiShoppingBag,
  FiImage,
  FiUser,
} from 'react-icons/fi';
import './BottomNav.css';

const navItems = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/menu', label: 'Menu', icon: FiGrid },
  { path: '/cart', label: 'Order', icon: FiShoppingBag },
  { path: '/gallery', label: 'Gallery', icon: FiImage },
  { path: '/profile', label: 'Profile', icon: FiUser },
];

export default function BottomNav() {
  const location = useLocation();
  const { state } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [ripple, setRipple] = useState(null);
  const navRef = useRef(null);

  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const idx = navItems.findIndex((item) => {
      if (item.path === '/') return location.pathname === '/';
      return location.pathname.startsWith(item.path);
    });
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [location.pathname]);

  // Profile or login redirect
  const getProfilePath = () => {
    return state.isAuthenticated ? '/profile' : '/login';
  };

  const handleTap = (index, e) => {
    // Create ripple effect
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ index, x, y, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <nav className="bottom-nav-container" ref={navRef} aria-label="Main navigation">
      <div className="bottom-nav-bar">
        {/* Active indicator glow */}
        <motion.div
          className="bottom-nav-active-glow"
          layoutId="bottom-nav-glow"
          animate={{
            x: `${activeIndex * 100}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
          }}
          style={{ width: `${100 / navItems.length}%` }}
        />

        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          const isOrder = item.label === 'Order';
          const isProfile = item.label === 'Profile';
          const linkPath = isProfile ? getProfilePath() : item.path;

          return (
            <Link
              key={item.path}
              to={linkPath}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={(e) => handleTap(index, e)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Ripple */}
              <AnimatePresence>
                {ripple && ripple.index === index && (
                  <motion.span
                    className="bottom-nav-ripple"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ left: ripple.x, top: ripple.y }}
                  />
                )}
              </AnimatePresence>

              {/* Icon container */}
              <motion.div
                className="bottom-nav-icon-wrap"
                animate={isActive ? {
                  scale: 1.15,
                  y: -2,
                } : {
                  scale: 1,
                  y: 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon className="bottom-nav-icon" />

                {/* Cart badge */}
                {isOrder && cartCount > 0 && (
                  <motion.span
                    className="bottom-nav-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}

                {/* Active glow dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="bottom-nav-active-dot"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label */}
              <motion.span
                className="bottom-nav-label"
                animate={isActive ? {
                  opacity: 1,
                  y: 0,
                  fontWeight: 700,
                } : {
                  opacity: 0.6,
                  y: 1,
                  fontWeight: 500,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
