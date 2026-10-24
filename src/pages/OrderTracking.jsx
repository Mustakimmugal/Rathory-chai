import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiPackage,
  FiSearch,
  FiShare2,
  FiPrinter,
} from 'react-icons/fi';
import './OrderTracking.css';

export default function OrderTracking() {
  const { state, addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('id');

  const [searchQuery, setSearchQuery] = useState(orderIdFromUrl || '');
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const idToFind = orderIdFromUrl || (state.orders.length > 0 ? state.orders[0].id : null);
    if (idToFind) {
      const found = state.orders.find((o) => o.id.toLowerCase() === idToFind.toLowerCase());
      setActiveOrder(found || state.orders[0]);
    }
  }, [orderIdFromUrl, state.orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const found = state.orders.find((o) => o.id.toLowerCase() === searchQuery.trim().toLowerCase());
    if (found) {
      setActiveOrder(found);
      setSearchParams({ id: found.id });
      addToast(`Showing details for Order ${found.id}`, 'info');
    } else {
      addToast(`No order found matching "${searchQuery}"`, 'error');
    }
  };

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', time: 'Just now', icon: '📝' },
    { key: 'preparing', label: 'Brewing & Boiling', time: 'In 5 mins', icon: '🔥' },
    { key: 'quality', label: 'Insulated Packaged', time: 'In 12 mins', icon: '🏺' },
    { key: 'out-for-delivery', label: 'Out For Delivery', time: 'In 20 mins', icon: '🚴' },
    { key: 'completed', label: 'Delivered Fresh', time: 'In 32 mins', icon: '✨' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'quality': return 3;
      case 'out-for-delivery': return 4;
      case 'completed': return 5;
      default: return 1;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.orderStatus) : 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div className="container">
          <span className="section-subtitle">Real-Time Updates</span>
          <h1 className="section-title">Track Your Royal Chai</h1>
          <div className="gold-line"></div>

          {/* ORDER SEARCH */}
          <form onSubmit={handleSearch} className="tracking-search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ORD-001 or your recent order)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Track
            </button>
          </form>
        </div>
      </div>

      <div className="container section">
        {activeOrder ? (
          <div className="tracking-container-grid">
            {/* LEFT: STATUS TRACKER */}
            <div className="tracking-main-card">
              <div className="tracking-card-header">
                <div>
                  <span className="order-id-badge">Order ID: {activeOrder.id}</span>
                  <h2 className="order-status-heading">
                    {activeOrder.orderStatus === 'completed'
                      ? 'Delivered with Royal Warmth 🎉'
                      : activeOrder.orderStatus === 'out-for-delivery'
                      ? 'Rider is on the way with piping hot chai! 🚴'
                      : 'Our Tea Master is brewing your kettle! 🔥'}
                  </h2>
                </div>

                <div className="tracking-actions">
                  <button onClick={handlePrint} className="btn-icon-action" title="Print Invoice">
                    <FiPrinter />
                  </button>
                </div>
              </div>

              {/* ESTIMATED TIME BANNER */}
              <div className="eta-banner">
                <FiClock className="eta-icon" />
                <div>
                  <strong>Estimated Boiling Arrival: 25 - 35 mins</strong>
                  <p>Kept in double-walled insulated stainless flasks.</p>
                </div>
              </div>

              {/* PROGRESS BAR STEPS */}
              <div className="progress-steps-wrapper">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx - 1;

                  return (
                    <div
                      key={step.key}
                      className={`step-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-circle">
                        <span>{step.icon}</span>
                      </div>
                      <div className="step-info">
                        <strong>{step.label}</strong>
                        <span>{step.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DELIVERY EXECUTIVE INFO */}
              <div className="rider-card">
                <div className="rider-avatar">🛵</div>
                <div className="rider-details">
                  <h4>Kailash Rathore</h4>
                  <span>Rathory Chai Specialist Rider • 4.95 ★</span>
                  <p>Vehicle: Ather EV • Sanitized insulated thermal bag</p>
                </div>
                <a href="tel:+919876543210" className="btn btn-outline btn-sm rider-call-btn">
                  <FiPhone /> Call Rider
                </a>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY RECEIPT */}
            <div className="tracking-receipt-card">
              <h3 className="receipt-title">Order Details</h3>

              <div className="receipt-meta">
                <div className="receipt-meta-row">
                  <span>Customer:</span>
                  <strong>{activeOrder.customerName}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span>Phone:</span>
                  <strong>{activeOrder.phone}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span>Destination:</span>
                  <p className="receipt-address">{activeOrder.address}</p>
                </div>
                <div className="receipt-meta-row">
                  <span>Payment:</span>
                  <span className={`payment-pill ${activeOrder.paymentStatus}`}>
                    {activeOrder.paymentMethod} ({activeOrder.paymentStatus.toUpperCase()})
                  </span>
                </div>
              </div>

              <div className="receipt-items-list">
                <h4>Items Ordered</h4>
                {activeOrder.items?.map((item, i) => (
                  <div key={i} className="receipt-item-line">
                    <div>
                      <strong>{item.qty}x</strong> {item.name}
                    </div>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-total-block">
                <div className="receipt-total-row">
                  <span>Grand Total Paid:</span>
                  <strong>₹{activeOrder.total}</strong>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Thank you for choosing Rathory Chai Wale! Enjoy every royal sip.</p>
                <Link to="/menu" className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
                  Order More Delicacies
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-order-placeholder">
            <p>Please search for an order or place a new order from our menu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
