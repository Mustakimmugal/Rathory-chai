import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX, FiCoffee, FiShare, FiPlusSquare } from 'react-icons/fi';
import './InstallPwaPrompt.css';

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously this session
    if (sessionStorage.getItem('pwa_prompt_dismissed')) {
      return;
    }

    // Check if already in standalone app mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delay prompt appearance so it doesn't disturb initial load
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS Safari, show helper after 4s
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pwa-install-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="pwa-install-card">
          <button className="pwa-close-btn" onClick={handleDismiss} aria-label="Close">
            <FiX />
          </button>

          <div className="pwa-card-content">
            <div className="pwa-app-icon-wrap">
              <div className="pwa-app-icon">
                <FiCoffee />
              </div>
            </div>

            <div className="pwa-text-col">
              <h4 className="pwa-title">Experience Rathory Chai App</h4>
              <p className="pwa-subtitle">
                {isIos ? (
                  <span>
                    Tap <FiShare className="inline-icon" /> then <strong>Add to Home Screen</strong> <FiPlusSquare className="inline-icon" />
                  </span>
                ) : (
                  'Instant orders, smooth gestures & offline access'
                )}
              </p>
            </div>

            {!isIos && deferredPrompt && (
              <button className="btn-install-pwa" onClick={handleInstallClick}>
                <FiDownload />
                <span>Install</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
