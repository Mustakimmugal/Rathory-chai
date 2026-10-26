import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './ToastContainer.css';

const icons = {
  success: FiCheck,
  error: FiAlertCircle,
  info: FiInfo,
};

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  return (
    <div className="premium-toast-container" role="alert" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {state.toasts.map((toast) => {
          const Icon = icons[toast.type] || FiInfo;
          return (
            <motion.div
              key={toast.id}
              className={`premium-toast toast-${toast.type}`}
              layout
              initial={{ opacity: 0, y: -40, scale: 0.85, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(4px)' }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              <div className="toast-icon-circle">
                <Icon size={16} />
              </div>
              <span className="toast-message">{toast.message}</span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
                className="toast-close-btn"
                aria-label="Dismiss"
              >
                <FiX size={14} />
              </button>
              {/* Auto-dismiss progress bar */}
              <motion.div
                className="toast-progress"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
