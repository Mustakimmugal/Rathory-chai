import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiLock, FiPhone, FiMail, FiUser, FiShield, FiArrowRight } from 'react-icons/fi';
import './Login.css';

export default function Login() {
  const { dispatch, addToast } = useApp();
  const navigate = useNavigate();

  const [loginMode, setLoginMode] = useState('customer'); // customer or admin
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoCustomerLogin = () => {
    const demoUser = {
      id: 1,
      name: 'Rajesh Sharma',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      address: '42, MG Road, Jaipur',
      role: 'customer',
      avatar: '👨‍🍳',
    };
    dispatch({ type: 'LOGIN', payload: demoUser });
    addToast('Welcome back, Rajesh ji! 🍵', 'success');
    navigate('/profile');
  };

  const handleDemoAdminLogin = () => {
    const adminUser = {
      id: 99,
      name: 'Rathore Ji (Administrator)',
      email: 'admin@rathorychaiwale.com',
      phone: '+91 99999 00000',
      address: 'Rathory Flagship Office, Jaipur',
      role: 'admin',
      avatar: '👑',
    };
    dispatch({ type: 'LOGIN', payload: adminUser });
    addToast('Admin Portal Access Granted! 👑', 'success');
    navigate('/admin');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier) {
      addToast('Please enter your phone or email', 'error');
      return;
    }

    if (loginMode === 'admin') {
      handleDemoAdminLogin();
    } else {
      const userObj = {
        id: Math.floor(Math.random() * 900) + 100,
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Chai Lover',
        email: identifier.includes('@') ? identifier : 'user@rathory.com',
        phone: identifier.includes('@') ? '+91 98765 43210' : identifier,
        address: 'Jaipur, Rajasthan',
        role: 'customer',
      };
      dispatch({ type: 'LOGIN', payload: userObj });
      addToast(`Logged in successfully! ☕`, 'success');
      navigate('/profile');
    }
  };

  return (
    <div className="login-page">
      <div className="login-backdrop"></div>
      <div className="container login-container">
        <div className="login-card">
          <div className="login-brand-header">
            <img src="/images/logo.jpg" alt="Rathory Chai" className="login-logo" />
            <h2>Royal Sign In</h2>
            <p>Access your orders, favorites, and exclusive privilege perks.</p>
          </div>

          {/* DEMO 1-CLICK BUTTONS */}
          <div className="demo-credentials-box">
            <span className="demo-tag">One-Click Instant Access</span>
            <div className="demo-btns-row">
              <button
                type="button"
                onClick={handleDemoCustomerLogin}
                className="btn btn-outline btn-sm demo-btn"
              >
                <FiUser /> Customer Demo
              </button>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="btn btn-primary btn-sm demo-btn"
              >
                <FiShield /> Admin Portal Demo
              </button>
            </div>
          </div>

          <div className="login-divider">
            <span>OR LOGIN WITH DETAILS</span>
          </div>

          <div className="login-type-switch">
            <button
              type="button"
              className={`mode-btn ${loginMode === 'customer' ? 'active' : ''}`}
              onClick={() => setLoginMode('customer')}
            >
              Customer Account
            </button>
            <button
              type="button"
              className={`mode-btn ${loginMode === 'admin' ? 'active' : ''}`}
              onClick={() => setLoginMode('admin')}
            >
              Admin Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{loginMode === 'admin' ? 'Admin Email' : 'Phone or Email'}</label>
              <div className="input-with-icon">
                {loginMode === 'admin' ? <FiMail /> : <FiPhone />}
                <input
                  type={loginMode === 'admin' ? 'email' : 'text'}
                  required
                  placeholder={loginMode === 'admin' ? 'admin@rathorychaiwale.com' : '+91 98765 43210'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password / OTP</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  type="password"
                  placeholder="Enter any password for demo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-submit-login">
              <span>{loginMode === 'admin' ? 'Login to Admin Dashboard' : 'Sign In with Chai Club'}</span>
              <FiArrowRight />
            </button>
          </form>

          <div className="login-footer-text">
            <span>By proceeding, you agree to Rathory Chai Wale Terms & Privacy.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
