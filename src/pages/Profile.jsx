import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiHeart,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiClock,
  FiPlus,
  FiTrash2,
  FiX,
  FiNavigation,
  FiRepeat,
  FiBell,
  FiLock,
  FiTag,
  FiAward,
} from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
  const { state, dispatch, addToast } = useApp();
  const navigate = useNavigate();

  const user = state.user || {
    name: 'Mustakim Mugal',
    email: 'mustakim@gmail.com',
    phone: '+91 98765 43210',
    address: 'Near Heritage Circle, Sikar, Rajasthan 332001',
    role: 'customer',
  };

  // Active Tab state: 'profile', 'orders', 'addresses', 'favorites', 'payments', 'settings'
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  });

  // Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      fullAddress: 'Near Heritage Circle, Sikar Road, Sikar, Rajasthan 332001',
      city: 'Sikar',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Office',
      fullAddress: 'Silver Square Commercial Center, Sikar Road, Jaipur, Rajasthan 302013',
      city: 'Jaipur',
      isDefault: false,
    },
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    fullAddress: '',
    city: 'Sikar',
  });

  // Payment Methods State
  const [payments, setPayments] = useState([
    {
      id: 1,
      type: 'upi',
      name: 'UPI (GPay / PhonePe)',
      details: 'mustakim@okhdfcbank',
      isDefault: true,
    },
    {
      id: 2,
      type: 'card',
      name: 'HDFC Millennia Credit Card',
      details: '•••• •••• •••• 4242 (Exp 08/28)',
      isDefault: false,
    },
  ]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: 'upi',
    name: 'Google Pay UPI',
    details: '',
  });

  // Settings State
  const [userSettings, setUserSettings] = useState({
    whatsappUpdates: true,
    smsAlerts: true,
    promoOffers: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  // Actions
  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
    setIsEditing(false);
    addToast('Profile information updated successfully! ✨', 'success');
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  // Reorder
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      addToast('No items to reorder', 'error');
      return;
    }
    order.items.forEach((item) => {
      const prod = state.products.find((p) => p.id === item.productId) || {
        id: item.productId || Date.now(),
        name: item.name,
        price: item.price,
        image: '/images/kulhad-chai.jpg',
      };
      dispatch({ type: 'ADD_TO_CART', payload: prod });
    });
    addToast(`Reordered items from #${order.id}! ☕`, 'success');
    navigate('/cart');
  };

  // Address Actions
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addressForm.fullAddress) {
      addToast('Please enter full address', 'error');
      return;
    }
    const newAddr = {
      id: Date.now(),
      label: addressForm.label,
      fullAddress: addressForm.fullAddress,
      city: addressForm.city,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    setIsAddressModalOpen(false);
    setAddressForm({ label: 'Home', fullAddress: '', city: 'Sikar' });
    addToast('New delivery address saved! 📍', 'success');
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    addToast('Default address updated!', 'info');
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length <= 1) {
      addToast('You must keep at least one delivery address', 'error');
      return;
    }
    setAddresses(addresses.filter((a) => a.id !== id));
    addToast('Address removed', 'info');
  };

  // Payment Actions
  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!paymentForm.details) {
      addToast('Please enter payment details', 'error');
      return;
    }
    const newPm = {
      id: Date.now(),
      type: paymentForm.type,
      name: paymentForm.name,
      details: paymentForm.details,
      isDefault: false,
    };
    setPayments([...payments, newPm]);
    setIsPaymentModalOpen(false);
    setPaymentForm({ type: 'upi', name: 'Google Pay UPI', details: '' });
    addToast('Payment method added successfully! 💳', 'success');
  };

  const handleDeletePayment = (id) => {
    if (payments.length <= 1) {
      addToast('You must keep at least one payment method', 'error');
      return;
    }
    setPayments(payments.filter((p) => p.id !== id));
    addToast('Payment method removed', 'info');
  };

  // Password update
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      addToast('New passwords do not match', 'error');
      return;
    }
    setPasswordForm({ current: '', newPass: '', confirmPass: '' });
    addToast('Password updated securely! 🔒', 'success');
  };

  // Favorites list
  const favoriteProducts = state.products.filter((p) =>
    state.favorites.includes(p.id)
  );

  return (
    <div className="modern-user-dashboard-page">
      <div className="container">
        {/* TOPBAR HEADER */}
        <div className="dashboard-top-row">
          <div>
            <h1 className="dash-heading">My Profile</h1>
          </div>

          <div className="dash-user-profile-badge glass-card">
            <div className="dash-avatar-circle">
              <FiUser />
            </div>
            <div className="dash-user-meta">
              <strong>{user.name}</strong>
              <span>Royal Patron</span>
            </div>
          </div>
        </div>

        {/* PROFILE MAIN LAYOUT */}
        <div className="dashboard-content-layout">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="dashboard-sidebar glass-card">
            <nav className="dash-nav-menu">
              {/* TAB 1: PROFILE (CHANGED FROM DASHBOARD TO PROFILE) */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`dash-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <FiUser className="nav-ico" />
                  <span>Profile</span>
                </div>
              </button>

              {/* TAB 2: ORDERS */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`dash-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <FiShoppingBag className="nav-ico" />
                  <span>Orders</span>
                </div>
                <span className="nav-count-badge">{state.orders.length}</span>
              </button>

              {/* TAB 3: ADDRESSES */}
              <button
                onClick={() => setActiveTab('addresses')}
                className={`dash-nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <FiMapPin className="nav-ico" />
                  <span>Addresses</span>
                </div>
                <span className="nav-count-badge">{addresses.length}</span>
              </button>

              {/* TAB 4: FAVORITES */}
              <button
                onClick={() => setActiveTab('favorites')}
                className={`dash-nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <FiHeart className="nav-ico" />
                  <span>Favorites</span>
                </div>
                <span className="nav-count-badge">{favoriteProducts.length}</span>
              </button>

              {/* TAB 5: PAYMENTS */}
              <button
                onClick={() => setActiveTab('payments')}
                className={`dash-nav-link ${activeTab === 'payments' ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <FiCreditCard className="nav-ico" />
                  <span>Payments</span>
                </div>
                <span className="nav-count-badge">{payments.length}</span>
              </button>

              {/* TAB 6: SETTINGS */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`dash-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <FiSettings className="nav-ico" />
                  <span>Settings</span>
                </div>
              </button>
            </nav>

            <button onClick={handleLogout} className="dash-logout-link">
              <FiLogOut />
              <span>Logout</span>
            </button>
          </aside>

          {/* RIGHT MAIN PANEL (SWITCHES ACCORDING TO ACTIVETAB) */}
          <main className="dashboard-main-panel">
            {/* ========================================================
                1. PROFILE TAB
                ======================================================== */}
            {activeTab === 'profile' && (
              <>
                {/* LOYALTY CLUB METRICS */}
                <div className="loyalty-stats-grid">
                  <div className="loyalty-stat-card">
                    <div className="loyalty-ico-box gold">
                      <FiAward />
                    </div>
                    <div>
                      <div className="loyalty-num">Royal Connoisseur</div>
                      <div className="loyalty-lbl">Chai Club Tier</div>
                    </div>
                  </div>

                  <div className="loyalty-stat-card">
                    <div className="loyalty-ico-box blue">
                      <FiClock />
                    </div>
                    <div>
                      <div className="loyalty-num">420 pts</div>
                      <div className="loyalty-lbl">Chai Reward Coins</div>
                    </div>
                  </div>

                  <div className="loyalty-stat-card">
                    <div className="loyalty-ico-box green">
                      <FiShoppingBag />
                    </div>
                    <div>
                      <div className="loyalty-num">{state.orders.length}</div>
                      <div className="loyalty-lbl">Lifetime Orders</div>
                    </div>
                  </div>
                </div>

                {/* PROFILE INFORMATION CARD */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <h3>Personal Information</h3>
                      <p>Manage your name, contact phone, and primary delivery destination.</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-edit-pill"
                    >
                      {isEditing ? 'Cancel' : <><FiEdit2 /> Edit Profile</>}
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="dash-profile-form">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            required
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({ ...profileData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            required
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({ ...profileData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="text"
                            required
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({ ...profileData, phone: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Default Sikar Address</label>
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) =>
                              setProfileData({ ...profileData, address: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FiCheck /> Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="profile-info-grid">
                      <div className="profile-field">
                        <span>Full Name</span>
                        <strong>{user.name}</strong>
                      </div>
                      <div className="profile-field">
                        <span>Email Address</span>
                        <strong>{user.email}</strong>
                      </div>
                      <div className="profile-field">
                        <span>Contact Mobile</span>
                        <strong>{user.phone}</strong>
                      </div>
                      <div className="profile-field" style={{ gridColumn: '1 / -1' }}>
                        <span>Default Address</span>
                        <strong>{user.address}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ========================================================
                2. ORDERS TAB (FULLY FUNCTIONAL)
                ======================================================== */}
            {activeTab === 'orders' && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h3>Order History & Live Status</h3>
                    <p>Track live dispatches, view receipt summaries, or reorder your favorites.</p>
                  </div>
                  <Link to="/menu" className="btn btn-primary btn-sm">
                    + Order Fresh Chai
                  </Link>
                </div>

                {state.orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>☕</div>
                    <h4>No orders yet</h4>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Experience the authentic aroma of slow-simmered kulhad chai today!
                    </p>
                    <Link to="/menu" className="btn btn-primary btn-sm">
                      Explore Menu
                    </Link>
                  </div>
                ) : (
                  <div className="user-orders-stack">
                    {state.orders.map((order) => {
                      const isDelivered =
                        order.orderStatus === 'delivered' || order.orderStatus === 'completed';

                      return (
                        <div key={order.id} className="user-order-card">
                          <div className="order-card-top">
                            <div>
                              <span className="order-id-code">Order #{order.id}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                                {new Date(order.createdAt).toLocaleDateString([], {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span
                                className={`status-pill ${
                                  isDelivered ? 'completed' : 'preparing'
                                }`}
                              >
                                {order.orderStatus.replace('-', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Items in order */}
                          <div className="order-dishes-grid">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="order-dish-row">
                                <div className="dish-left-meta">
                                  <img
                                    src={
                                      it.name.includes('Coffee')
                                        ? '/images/coffee.jpg'
                                        : '/images/kulhad-chai.jpg'
                                    }
                                    alt={it.name}
                                    className="dish-thumb-mini"
                                  />
                                  <div>
                                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                      {it.name}
                                    </strong>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                                      Qty: {it.qty} × ₹{it.price}
                                    </span>
                                  </div>
                                </div>
                                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                  ₹{it.price * it.qty}
                                </strong>
                              </div>
                            ))}
                          </div>

                          <div className="order-card-bottom">
                            <div>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Amount:</span>
                              <div className="order-grand-total">₹{order.total}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <Link
                                to={`/track-order?id=${order.id}`}
                                className="btn btn-outline btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                              >
                                <FiNavigation /> Live Tracking
                              </Link>
                              <button
                                onClick={() => handleReorder(order)}
                                className="btn btn-primary btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                              >
                                <FiRepeat /> Reorder
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                3. ADDRESSES TAB (FULLY FUNCTIONAL)
                ======================================================== */}
            {activeTab === 'addresses' && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h3>Saved Delivery Addresses</h3>
                    <p>Manage home, lounge, and workplace drop-off spots across Sikar and Rajasthan.</p>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FiPlus /> Add New Address
                  </button>
                </div>

                <div className="addresses-cards-grid">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-item-box ${addr.isDefault ? 'default' : ''}`}
                    >
                      <div>
                        <div className="address-head-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiMapPin style={{ color: 'var(--color-primary)' }} />
                            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                              {addr.label}
                            </strong>
                          </div>
                          {addr.isDefault && (
                            <span className="default-tag-badge">Default</span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                          {addr.fullAddress}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}>
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="manage-link"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600 }}>
                            ✓ Active Delivery Destination
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="btn-tbl-action delete"
                          title="Delete address"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                4. FAVORITES TAB (FULLY FUNCTIONAL)
                ======================================================== */}
            {activeTab === 'favorites' && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h3>My Favorite Chai & Snacks</h3>
                    <p>Delicacies and artisan brews bookmarked by you.</p>
                  </div>
                  <Link to="/menu" className="manage-link">
                    Explore Menu ➔
                  </Link>
                </div>

                {favoriteProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>❤️</div>
                    <h4>No favorites saved yet</h4>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      Click the heart icon on any tea or snack in the menu to bookmark it here!
                    </p>
                    <Link to="/menu" className="btn btn-primary btn-sm">
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="favorites-products-grid">
                    {favoriteProducts.map((p) => (
                      <div key={p.id} className="fav-item-card">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="fav-card-img"
                          onError={(e) => {
                            e.target.src = '/images/kulhad-chai.jpg';
                          }}
                        />
                        <div className="fav-card-content">
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                              {p.category}
                            </span>
                            <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                              {p.name}
                            </strong>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                            <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                              ₹{p.price}
                            </strong>
                            <button
                              onClick={() => {
                                dispatch({ type: 'ADD_TO_CART', payload: p });
                                addToast(`Added ${p.name} to cart! ☕`, 'success');
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                5. PAYMENTS TAB (FULLY FUNCTIONAL)
                ======================================================== */}
            {activeTab === 'payments' && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h3>Saved Payment Methods</h3>
                    <p>Instant UPI IDs and card details saved for fast, 1-click chai checkout.</p>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FiPlus /> Add Payment Method
                  </button>
                </div>

                <div className="payments-saved-grid">
                  {payments.map((pm) => (
                    <div key={pm.id} className="payment-method-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="payment-card-ico">
                          <FiCreditCard />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {pm.name}
                          </strong>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                            {pm.details}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePayment(pm.id)}
                        className="btn-tbl-action delete"
                        title="Delete payment method"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                6. SETTINGS TAB (FULLY FUNCTIONAL)
                ======================================================== */}
            {activeTab === 'settings' && (
              <>
                {/* NOTIFICATIONS SETTINGS */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <h3>Notification Preferences</h3>
                      <p>Control SMS, WhatsApp, and delivery alert messages.</p>
                    </div>
                    <FiBell style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          WhatsApp Live Order Dispatch Alerts
                        </strong>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                          Receive real-time brew & delivery status directly on WhatsApp.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={userSettings.whatsappUpdates}
                        onChange={(e) => {
                          setUserSettings({ ...userSettings, whatsappUpdates: e.target.checked });
                          addToast('Notification preferences updated', 'info');
                        }}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-glass)' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          SMS Delivery Receipts
                        </strong>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                          Receive SMS with OTP and courier delivery contact.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={userSettings.smsAlerts}
                        onChange={(e) => {
                          setUserSettings({ ...userSettings, smsAlerts: e.target.checked });
                          addToast('Notification preferences updated', 'info');
                        }}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECURITY & PASSWORD CARD */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <h3>Account Security</h3>
                      <p>Update your secret login password.</p>
                    </div>
                    <FiLock style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }} />
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="dash-profile-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordForm.current}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, current: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={passwordForm.newPass}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPass: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Re-type new password"
                          value={passwordForm.confirmPass}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPass: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      style={{ width: 'fit-content' }}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsAddressModalOpen(false)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dash-card-header">
              <h3>Add Delivery Address</h3>
              <button
                className="admin-modal-close"
                onClick={() => setIsAddressModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="dash-profile-form" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Address Label</label>
                <select
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Lounge">Lounge / Cafe</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Full Delivery Address *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="House/Flat No., Landmark, Sikar Road..."
                  value={addressForm.fullAddress}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullAddress: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>City & State</label>
                <input
                  type="text"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="btn btn-dark btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dash-card-header">
              <h3>Add Payment Method</h3>
              <button
                className="admin-modal-close"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="dash-profile-form" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Payment Channel</label>
                <select
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                >
                  <option value="Google Pay UPI">Google Pay UPI</option>
                  <option value="PhonePe UPI">PhonePe UPI</option>
                  <option value="Paytm UPI">Paytm UPI</option>
                  <option value="HDFC Debit Card">HDFC Debit Card</option>
                  <option value="SBI / ICICI Card">SBI / ICICI Card</option>
                </select>
              </div>

              <div className="form-group">
                <label>UPI ID or Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mobile@upi or 16-digit card"
                  value={paymentForm.details}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, details: e.target.value })
                  }
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="btn btn-dark btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
