import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { salesData } from '../../data/appData';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiDownload,
  FiCheck,
} from 'react-icons/fi';
import './Dashboard.css';

export default function AdminDashboard() {
  const { state, dispatch, addToast } = useApp();
  const [chartPeriod, setChartPeriod] = useState('monthly'); // daily, weekly, monthly, yearly
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const stats = state.dashboardStats;
  const recentOrders = state.orders.slice(0, 5);

  const topProducts = [
    { name: 'Masala Chai', sold: 1340, percent: 90, image: '/images/masala-chai.jpg' },
    { name: 'Cold Coffee', sold: 980, percent: 72, image: '/images/coffee.jpg' },
    { name: 'Veg Sandwich', sold: 756, percent: 58, image: '/images/hero-bg.jpg' },
    { name: 'Burger', sold: 642, percent: 50, image: '/images/hero-bg.jpg' },
    { name: 'Chocolate Cake', sold: 521, percent: 42, image: '/images/hero-bg.jpg' },
  ];

  // Chart data
  const chartPoints =
    chartPeriod === 'monthly'
      ? salesData.monthly
      : chartPeriod === 'weekly'
      ? salesData.weekly
      : salesData.daily.slice(-8);

  const chartLabels =
    chartPeriod === 'monthly'
      ? salesData.monthlyLabels
      : chartPeriod === 'weekly'
      ? salesData.weeklyLabels
      : salesData.dailyLabels.slice(-8);

  const maxVal = Math.max(...chartPoints);
  const minVal = Math.min(...chartPoints) * 0.8;

  // Generate smooth SVG spline curve
  const svgWidth = 620;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = chartPoints.map((val, idx) => {
    const x = paddingX + (idx / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { x, y, val, label: chartLabels[idx] };
  });

  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = points[idx - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="saas-dashboard-page">
      {/* HEADER ROW */}
      <div className="saas-dash-header">
        <div>
          <h1 className="saas-title">Admin Dashboard</h1>
          <p className="saas-sub">Welcome back, Admin!</p>
        </div>

        <div className="saas-header-actions">
          <Link to="/admin/products" className="btn btn-primary btn-sm">
            <FiPlus /> Add Delicacy
          </Link>
        </div>
      </div>

      {/* 4 STATS METRIC CARDS */}
      <div className="saas-metric-cards-grid">
        {/* TOTAL SALES */}
        <div className="saas-metric-card glass-card card-indigo">
          <div className="metric-icon-bubble">
            <FiDownload />
          </div>
          <div className="metric-card-data">
            <span className="metric-label">Total Sales</span>
            <strong className="metric-val">₹{stats.totalSales.toLocaleString('en-IN')}</strong>
            <span className="metric-trend up">
              <FiTrendingUp /> +{stats.revenueGrowth}% this month
            </span>
          </div>
        </div>

        {/* TODAY'S SALES */}
        <div className="saas-metric-card glass-card card-teal">
          <div className="metric-icon-bubble">
            <FiBarChart2 />
          </div>
          <div className="metric-card-data">
            <span className="metric-label">Today's Sales</span>
            <strong className="metric-val">₹{stats.todaySales.toLocaleString('en-IN')}</strong>
            <span className="metric-trend up">
              <FiTrendingUp /> +12.4% yesterday
            </span>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="saas-metric-card glass-card card-orange">
          <div className="metric-icon-bubble">
            <FiShoppingBag />
          </div>
          <div className="metric-card-data">
            <span className="metric-label">Total Orders</span>
            <strong className="metric-val">{stats.totalOrders}</strong>
            <span className="metric-trend active-orders">
              • {stats.pendingOrders} Active
            </span>
          </div>
        </div>

        {/* TOTAL CUSTOMERS */}
        <div className="saas-metric-card glass-card card-purple">
          <div className="metric-icon-bubble">
            <FiUsers />
          </div>
          <div className="metric-card-data">
            <span className="metric-label">Total Customers</span>
            <strong className="metric-val">{stats.totalCustomers}</strong>
            <span className="metric-trend up">
              <FiTrendingUp /> +{stats.customerGrowth}% growth
            </span>
          </div>
        </div>
      </div>

      {/* ROW 2: SALES OVERVIEW CHART & TOP PRODUCTS */}
      <div className="saas-dash-row-2">
        {/* SALES OVERVIEW CHART */}
        <div className="saas-chart-card glass-card">
          <div className="saas-chart-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Dynamic revenue curve</p>
            </div>

            <div className="saas-chart-period-pills">
              {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`saas-period-btn ${chartPeriod === period ? 'active' : ''}`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="saas-svg-chart-container">
            {hoveredPoint && (
              <div
                className="saas-chart-tooltip glass-card"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100 - 15}%`,
                }}
              >
                <strong>₹{hoveredPoint.val.toLocaleString('en-IN')}</strong>
                <span>{hoveredPoint.label}</span>
              </div>
            )}

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="saas-svg-chart">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0.25, 0.5, 0.75].map((pct, idx) => (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={paddingY + pct * (svgHeight - paddingY * 2)}
                  x2={svgWidth - paddingX}
                  y2={paddingY + pct * (svgHeight - paddingY * 2)}
                  stroke="var(--border-glass)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area fill */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Stroke spline */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className="chart-circle-point"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Labels row */}
            <div className="saas-chart-labels-row">
              {points.map((p, i) => (
                <span key={i} className="saas-axis-label">
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TOP PRODUCTS PROGRESS LIST */}
        <div className="saas-top-products-card glass-card">
          <div className="top-prods-header">
            <h3>Top Products</h3>
            <Link to="/admin/products" className="manage-txt-link">
              Manage
            </Link>
          </div>

          <div className="top-prods-list">
            {topProducts.map((p, idx) => (
              <div key={idx} className="top-prod-row">
                <img src={p.image} alt={p.name} className="top-prod-thumb" />
                <div className="top-prod-info">
                  <div className="top-prod-title-row">
                    <strong>{p.name}</strong>
                    <span>{p.sold}</span>
                  </div>
                  <div className="top-prod-bar-track">
                    <div
                      className="top-prod-bar-fill"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: RECENT ORDERS & QUICK ACTIONS */}
      <div className="saas-dash-row-3">
        {/* RECENT ORDERS TABLE */}
        <div className="saas-table-card glass-card">
          <div className="saas-table-head">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="manage-txt-link">
              View All
            </Link>
          </div>

          <div className="saas-table-wrapper">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <span className="order-id-txt">{ord.id}</span>
                    </td>
                    <td>
                      <strong>{ord.customerName}</strong>
                    </td>
                    <td>
                      <span className="items-txt">
                        {ord.items?.length || 1} items
                      </span>
                    </td>
                    <td>
                      <strong className="amt-txt">₹{ord.total}</strong>
                    </td>
                    <td>
                      <span className={`saas-status-pill ${ord.orderStatus}`}>
                        {ord.orderStatus === 'completed' || ord.orderStatus === 'delivered'
                          ? 'Delivered'
                          : ord.orderStatus === 'preparing'
                          ? 'Preparing'
                          : 'Confirmed'}
                      </span>
                    </td>
                    <td>
                      <Link to="/admin/orders" className="saas-btn-view">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="saas-quick-actions-card glass-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions-buttons-grid">
            <Link to="/admin/products" className="quick-action-tile glass-card">
              <div className="tile-ico-wrap blue">
                <FiPlus />
              </div>
              <span>Add Product</span>
            </Link>

            <Link to="/admin/orders" className="quick-action-tile glass-card">
              <div className="tile-ico-wrap purple">
                <FiShoppingBag />
              </div>
              <span>Manage Orders</span>
            </Link>

            <Link to="/admin/customers" className="quick-action-tile glass-card">
              <div className="tile-ico-wrap cyan">
                <FiUsers />
              </div>
              <span>View Customers</span>
            </Link>

            <Link to="/admin/analytics" className="quick-action-tile glass-card">
              <div className="tile-ico-wrap green">
                <FiBarChart2 />
              </div>
              <span>Sales Report</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
