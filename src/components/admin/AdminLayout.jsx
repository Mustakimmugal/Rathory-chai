import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../ThemeToggle';
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiArchive,
  FiImage,
  FiSettings,
  FiArrowLeft,
  FiBell,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiCoffee,
  FiCalendar,
} from 'react-icons/fi';
import './AdminLayout.css';

export default function AdminLayout() {
  const { state, dispatch, addToast } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrdersCount = state.orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed' || o.orderStatus === 'preparing'
  ).length;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    addToast('Logged out of Admin Portal', 'info');
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
    { path: '/admin/products', label: 'Products', icon: <FiBox /> },
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: <FiShoppingBag />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    { path: '/admin/customers', label: 'Customers', icon: <FiUsers /> },
    { path: '/admin/analytics', label: 'Sales Analytics', icon: <FiBarChart2 /> },
    { path: '/admin/inventory', label: 'Inventory', icon: <FiArchive /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <FiImage /> },
    { path: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="modern-admin-wrapper">
      {/* SIDEBAR */}
      <aside className={`modern-admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-side-brand">
          <Link to="/admin" className="admin-brand-link">
            <div className="admin-brand-logo-ico">
              <FiCoffee />
            </div>
            <div>
              <span className="admin-brand-title">Rathory</span>
              <span className="admin-brand-sub">Chai Wale</span>
            </div>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="admin-side-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `admin-side-item ${isActive ? 'active' : ''}`}
            >
              <span className="side-ico">{item.icon}</span>
              <span className="side-lbl">{item.label}</span>
              {item.badge && <span className="side-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-side-foot">
          <Link to="/" className="btn-exit-store">
            <FiArrowLeft /> Return to Cafe
          </Link>
          <button onClick={handleLogout} className="btn-side-logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN ADMIN AREA */}
      <div className="modern-admin-main">
        {/* TOPBAR */}
        <header className="modern-admin-topbar">
          <div className="topbar-left-box">
            <button
              className="topbar-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
            <div className="admin-date-badge glass-card">
              <FiCalendar />
              <span>12 Oct 2025</span>
            </div>
          </div>

          <div className="topbar-right-box">
            <ThemeToggle />

            <Link to="/admin/orders" className="topbar-notif-btn" title="Live orders alert">
              <FiBell />
              {pendingOrdersCount > 0 && <span className="admin-notif-dot" />}
            </Link>

            <div className="admin-profile-pill glass-card">
              <div className="admin-avatar-ico">👑</div>
              <div className="admin-name-role">
                <strong>Admin</strong>
                <span>Rathory HQ</span>
              </div>
            </div>
          </div>
        </header>

        {/* OUTLET BODY */}
        <main className="modern-admin-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
