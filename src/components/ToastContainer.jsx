import React from 'react';
import { useApp } from '../context/AppContext';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  return (
    <div className="toast-container">
      {state.toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
            style={{ background: 'none', color: 'inherit', marginLeft: 'auto', padding: '4px' }}
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
