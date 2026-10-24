import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FiSave,
  FiRefreshCw,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiBell,
  FiSliders,
  FiCheck,
  FiCompass,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import './AdminCommon.css';
import './Settings.css';

export default function AdminSettings() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const [settings, setSettings] = useState({
    // Store Info
    storeName: 'Rathory Chai',
    tagline: 'Taste The Royal Heritage — Har Cup Mein Ek Kahani',
    phone: '+91 98765 43210',
    email: 'namaste@rathorychai.com',
    address: 'Rathoree Chai, Near Heritage Circle, Sikar, Rajasthan 332001',
    mapsUrl:
      'https://www.google.com/maps/place/Rathoree+chai/@27.6278275,75.1352257,17z/data=!4m14!1m7!3m6!1s0x396ca5002f3cee9d:0xcb43adfc5fda6b56!2sRathoree+chai!8m2!3d27.6278275!4d75.1352257!16s%2Fg%2F11zy5k2_y5',

    // Operating Hours & Live Online Status
    isOpenForOrders: true,
    openingTime: '07:00',
    closingTime: '23:30',
    prepTimeMins: 15,
    deliveryRadiusKm: 12,

    // Pricing, Taxes & Delivery
    deliveryFee: 30,
    freeDeliveryThreshold: 199,
    gstRate: 5,
    codEnabled: true,
    upiEnabled: true,

    // Audio & Alerts
    soundAlerts: true,
    whatsappAlerts: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('All store & cafe settings updated successfully! ⚙️☕', 'success');
  };

  const handleReset = () => {
    setSettings({
      storeName: 'Rathory Chai',
      tagline: 'Taste The Royal Heritage — Har Cup Mein Ek Kahani',
      phone: '+91 98765 43210',
      email: 'namaste@rathorychai.com',
      address: 'Rathoree Chai, Near Heritage Circle, Sikar, Rajasthan 332001',
      mapsUrl:
        'https://www.google.com/maps/place/Rathoree+chai/@27.6278275,75.1352257,17z/data=!4m14!1m7!3m6!1s0x396ca5002f3cee9d:0xcb43adfc5fda6b56!2sRathoree+chai!8m2!3d27.6278275!4d75.1352257!16s%2Fg%2F11zy5k2_y5',
      isOpenForOrders: true,
      openingTime: '07:00',
      closingTime: '23:30',
      prepTimeMins: 15,
      deliveryRadiusKm: 12,
      deliveryFee: 30,
      freeDeliveryThreshold: 199,
      gstRate: 5,
      codEnabled: true,
      upiEnabled: true,
      soundAlerts: true,
      whatsappAlerts: true,
    });
    addToast('Settings restored to defaults', 'info');
  };

  return (
    <div className="admin-page settings-page">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store & Cafe Settings</h1>
          <p className="admin-page-subtitle">
            Configure brand identity, operating hours, delivery thresholds, and live cafe ordering status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-dark btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw /> Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiSave /> Save Settings
          </button>
        </div>
      </div>

      {/* QUICK SECTION TABS */}
      <div className="settings-nav-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`settings-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          <FiSliders /> All Settings
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`settings-tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
        >
          <FiMapPin /> Brand & Location
        </button>
        <button
          onClick={() => setActiveTab('timing')}
          className={`settings-tab-btn ${activeTab === 'timing' ? 'active' : ''}`}
        >
          <FiClock /> Hours & Live Status
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`settings-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
        >
          <FiDollarSign /> Delivery & Billing
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`settings-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
        >
          <FiBell /> Alerts & Kitchen
        </button>
      </div>

      <form onSubmit={handleSave} className="settings-sections-stack">
        {/* 1. BRAND & LOCATION */}
        {(activeTab === 'all' || activeTab === 'brand') && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-head-title">
                <div className="settings-head-icon gold">
                  <FiCompass />
                </div>
                <div>
                  <h3>Brand Identity & Lounge Location</h3>
                  <p>Display information shown on customer storefront, receipts, and invoices.</p>
                </div>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-field-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  required
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                />
              </div>

              <div className="settings-field-group">
                <label>Signature Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                />
              </div>

              <div className="settings-field-group">
                <label>Customer Support Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>

              <div className="settings-field-group">
                <label>Official Concierge Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>

              <div className="settings-field-group full-width">
                <label>Lounge Address (Sikar, Rajasthan)</label>
                <textarea
                  rows="2"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>

              <div className="settings-field-group full-width">
                <label>Google Maps Direct URL</label>
                <input
                  type="url"
                  value={settings.mapsUrl}
                  onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. OPERATING HOURS & LIVE STATUS */}
        {(activeTab === 'all' || activeTab === 'timing') && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-head-title">
                <div className="settings-head-icon blue">
                  <FiClock />
                </div>
                <div>
                  <h3>Operating Hours & Live Service Status</h3>
                  <p>Control when the cafe accepts orders and manage kitchen preparation speed.</p>
                </div>
              </div>

              <div>
                <span
                  className={`live-status-indicator ${
                    settings.isOpenForOrders ? 'open' : 'closed'
                  }`}
                >
                  <span className="live-dot" />
                  {settings.isOpenForOrders ? 'CAFE IS OPEN' : 'CAFE IS CLOSED'}
                </span>
              </div>
            </div>

            {/* LIVE SWITCH ROW */}
            <div className="settings-switch-row">
              <div className="switch-info">
                <strong>Accept Online Customer Orders</strong>
                <p>When toggled off, customers cannot checkout and will see "Currently Closed" banner.</p>
              </div>

              <label className="toggle-switch-wrap">
                <input
                  type="checkbox"
                  checked={settings.isOpenForOrders}
                  onChange={(e) =>
                    setSettings({ ...settings, isOpenForOrders: e.target.checked })
                  }
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-form-grid">
              <div className="settings-field-group">
                <label>Daily Opening Time</label>
                <input
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                />
              </div>

              <div className="settings-field-group">
                <label>Daily Closing Time</label>
                <input
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                />
              </div>

              <div className="settings-field-group">
                <label>Average Prep Time (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={settings.prepTimeMins}
                  onChange={(e) =>
                    setSettings({ ...settings, prepTimeMins: Number(e.target.value) })
                  }
                />
              </div>

              <div className="settings-field-group">
                <label>Max Delivery Radius (km)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.deliveryRadiusKm}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryRadiusKm: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. PRICING, DELIVERY & GST */}
        {(activeTab === 'all' || activeTab === 'pricing') && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-head-title">
                <div className="settings-head-icon green">
                  <FiDollarSign />
                </div>
                <div>
                  <h3>Delivery Pricing, Thresholds & Taxes</h3>
                  <p>Configure automatic delivery charges and GST applied to cart checkout.</p>
                </div>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-field-group">
                <label>Standard Delivery Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.deliveryFee}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryFee: Number(e.target.value) })
                  }
                />
              </div>

              <div className="settings-field-group">
                <label>Free Delivery Minimum Order (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeDeliveryThreshold: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="settings-field-group">
                <label>Restaurant GST Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={settings.gstRate}
                  onChange={(e) =>
                    setSettings({ ...settings, gstRate: Number(e.target.value) })
                  }
                />
              </div>

              <div className="settings-field-group">
                <label>Currency Symbol</label>
                <input type="text" value="₹ (INR)" disabled style={{ opacity: 0.7 }} />
              </div>
            </div>

            {/* Payment toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0.5rem' }}>
              <div className="settings-switch-row">
                <div className="switch-info">
                  <strong>Enable Instant UPI & QR Checkout</strong>
                  <p>Allow patrons to pay via Google Pay, PhonePe, Paytm, or UPI scanner.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input
                    type="checkbox"
                    checked={settings.upiEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, upiEnabled: e.target.checked })
                    }
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="settings-switch-row">
                <div className="switch-info">
                  <strong>Enable Cash on Delivery / Counter Pay</strong>
                  <p>Accept cash payments upon delivery or table presentation.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, codEnabled: e.target.checked })
                    }
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS & ALERTS */}
        {(activeTab === 'all' || activeTab === 'alerts') && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-head-title">
                <div className="settings-head-icon purple">
                  <FiBell />
                </div>
                <div>
                  <h3>Kitchen Audio & Customer Notifications</h3>
                  <p>Manage order dispatch sound chimes and automated customer updates.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="settings-switch-row">
                <div className="switch-info">
                  <strong>New Order Chime (Kitchen Audio)</strong>
                  <p>Play loud bell chime when a new live order arrives on the dashboard.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={(e) =>
                      setSettings({ ...settings, soundAlerts: e.target.checked })
                    }
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="settings-switch-row">
                <div className="switch-info">
                  <strong>Customer WhatsApp / SMS Status Alerts</strong>
                  <p>Notify customers when their chai is brewing and out for delivery.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input
                    type="checkbox"
                    checked={settings.whatsappAlerts}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsappAlerts: e.target.checked })
                    }
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SAVE ACTIONS */}
        <div className="settings-bottom-actions">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-dark btn-sm"
          >
            Cancel & Revert
          </button>
          <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCheck />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
