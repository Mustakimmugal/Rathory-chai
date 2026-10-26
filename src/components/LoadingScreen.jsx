import React from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="premium-loading-screen">
      {/* Ambient glow background */}
      <div className="loading-ambient-orb orb-1" />
      <div className="loading-ambient-orb orb-2" />

      <motion.div
        className="loading-center-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated brand icon */}
        <div className="loading-brand-ring">
          <div className="loading-ring-spinner" />
          <div className="loading-brand-icon">☕</div>
        </div>

        <motion.p
          className="loading-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Brewing something special...
        </motion.p>

        {/* Shimmer bar */}
        <div className="loading-shimmer-bar">
          <div className="loading-shimmer-fill" />
        </div>
      </motion.div>
    </div>
  );
}
