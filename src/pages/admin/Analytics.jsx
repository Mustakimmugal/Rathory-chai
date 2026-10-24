import React, { useState } from 'react';
import { salesData } from '../../data/appData';
import { useApp } from '../../context/AppContext';
import {
  FiTrendingUp,
  FiDollarSign,
  FiRepeat,
  FiClock,
  FiAward,
  FiDownload,
  FiCalendar,
  FiPieChart,
  FiSmartphone,
  FiCreditCard,
  FiZap,
} from 'react-icons/fi';
import './AdminCommon.css';
import './Analytics.css';

export default function AdminAnalytics() {
  const { addToast } = useApp();
  const [chartPeriod, setChartPeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Category Revenue Share
  const categoryShare = [
    { name: 'Special Chai (Saffron & Kahwa)', percent: 38, revenue: 306280, color: '#F59E0B' },
    { name: 'Classic Masala & Adrak Chai', percent: 32, revenue: 257920, color: '#D97706' },
    { name: 'Authentic Kulhad Chai', percent: 18, revenue: 145080, color: '#FB923C' },
    { name: 'Crispy Snacks & Bun Maska', percent: 8, revenue: 64480, color: '#10B981' },
    { name: 'Artisan Coffee & Cold Shakes', percent: 4, revenue: 32240, color: '#3B82F6' },
  ];

  // Payment Channel Distribution
  const paymentShare = [
    { method: 'UPI (GPay / PhonePe / Paytm / QR)', share: 64, icon: <FiSmartphone />, color: '#10B981' },
    { method: 'Cards (Visa, RuPay, MasterCard)', share: 22, icon: <FiCreditCard />, color: '#3B82F6' },
    { method: 'Cash On Counter / Table Pay', share: 14, icon: <FiDollarSign />, color: '#F59E0B' },
  ];

  // Rush Hours Timeline
  const rushHours = [
    { title: 'Morning Chai Surge', time: '07:00 AM – 10:30 AM', load: 28, status: 'warm', badge: 'Busy' },
    { title: 'Afternoon Office Sip', time: '11:00 AM – 03:30 PM', load: 18, status: 'calm', badge: 'Steady' },
    { title: 'Evening Prime Peak', time: '04:00 PM – 07:30 PM', load: 42, status: 'hot', badge: '🔥 Super Rush' },
    { title: 'Night Dessert & Dine', time: '08:00 PM – 11:30 PM', load: 12, status: 'calm', badge: 'Cozy' },
  ];

  // Chart Data Preparation
  const chartPoints =
    chartPeriod === 'monthly'
      ? salesData.monthly
      : chartPeriod === 'weekly'
      ? salesData.weekly
      : salesData.daily;

  const chartLabels =
    chartPeriod === 'monthly'
      ? salesData.monthlyLabels
      : chartPeriod === 'weekly'
      ? salesData.weeklyLabels
      : salesData.dailyLabels;

  const maxVal = Math.max(...chartPoints);
  const minVal = Math.min(...chartPoints) * 0.85;

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const points = chartPoints.map((val, idx) => {
    const x = paddingX + (idx / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
    const y =
      svgHeight -
      paddingY -
      ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - paddingY * 2);
    return { x, y, val, label: chartLabels[idx] };
  });

  // Smooth spline path
  const splinePath = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${splinePath} L ${points[points.length - 1]?.x} ${svgHeight - paddingY} L ${
    points[0]?.x
  } ${svgHeight - paddingY} Z`;

  const handleExport = () => {
    addToast('Sales Analytics report exported successfully (CSV & PDF) 📊', 'success');
  };

  return (
    <div className="admin-page analytics-page">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sales & Growth Analytics</h1>
          <p className="admin-page-subtitle">
            Comprehensive financial reporting, category performance, and tea consumption trends.
          </p>
        </div>

        <button onClick={handleExport} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiDownload />
          <span>Export Analytics</span>
        </button>
      </div>

      {/* TOP EXECUTIVE KPI ROW */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">Gross Revenue</span>
            <div className="kpi-icon-badge gold">
              <FiDollarSign />
            </div>
          </div>
          <div className="kpi-main-num">₹8,06,000</div>
          <div className="kpi-footer-trend">
            <span className="trend-badge-pill up">
              <FiTrendingUp /> +18.5%
            </span>
            <span>vs previous month</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">Average Order Value</span>
            <div className="kpi-icon-badge blue">
              <FiAward />
            </div>
          </div>
          <div className="kpi-main-num">₹283</div>
          <div className="kpi-footer-trend">
            <span className="trend-badge-pill up">
              <FiTrendingUp /> +8.2%
            </span>
            <span>order basket size</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">Repeat Chai Lovers</span>
            <div className="kpi-icon-badge green">
              <FiRepeat />
            </div>
          </div>
          <div className="kpi-main-num">68.4%</div>
          <div className="kpi-footer-trend">
            <span className="trend-badge-pill up">
              <FiTrendingUp /> +5.1%
            </span>
            <span>high patron retention</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">Gross Margin</span>
            <div className="kpi-icon-badge purple">
              <FiZap />
            </div>
          </div>
          <div className="kpi-main-num">72.4%</div>
          <div className="kpi-footer-trend">
            <span className="trend-badge-pill gold">
              ★ Premium
            </span>
            <span>hand-crushed signature blends</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SALES REVENUE TREND CHART */}
      <div className="analytics-chart-card">
        <div className="chart-card-header">
          <div className="chart-header-title">
            <h3>Revenue Trend Overview</h3>
            <p>Interactive sales curve tracking gross cafe and online orders.</p>
          </div>

          <div className="chart-period-tabs">
            <button
              onClick={() => { setChartPeriod('daily'); setHoveredIndex(null); }}
              className={`chart-period-btn ${chartPeriod === 'daily' ? 'active' : ''}`}
            >
              Daily
            </button>
            <button
              onClick={() => { setChartPeriod('weekly'); setHoveredIndex(null); }}
              className={`chart-period-btn ${chartPeriod === 'weekly' ? 'active' : ''}`}
            >
              Weekly
            </button>
            <button
              onClick={() => { setChartPeriod('monthly'); setHoveredIndex(null); }}
              className={`chart-period-btn ${chartPeriod === 'monthly' ? 'active' : ''}`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* SVG Spline & Area Graph */}
        <div className="analytics-svg-wrapper">
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div className="chart-tooltip-badge">
              <span>{points[hoveredIndex].label}:</span>
              <strong className="tooltip-val">₹{points[hoveredIndex].val.toLocaleString('en-IN')}</strong>
            </div>
          )}

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="analyticsGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="analyticsGradientLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0.2, 0.5, 0.8].map((ratio, i) => (
              <line
                key={i}
                x1={paddingX}
                y1={paddingY + ratio * (svgHeight - paddingY * 2)}
                x2={svgWidth - paddingX}
                y2={paddingY + ratio * (svgHeight - paddingY * 2)}
                className="chart-grid-line"
              />
            ))}

            {/* Area Fill */}
            <path d={areaPath} className="chart-area-fill" />

            {/* Spline Path */}
            <path d={splinePath} className="chart-spline-path" />

            {/* Interactive Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIndex === idx ? 7 : 4}
                  className={`chart-interactive-point ${hoveredIndex === idx ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
                <text
                  x={pt.x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  className="chart-x-label"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* TWO COLUMN GRID: CATEGORY SHARE & PAYMENT METHODS */}
      <div className="analytics-grid-2">
        {/* Category Contribution */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Revenue by Tea & Accompaniment
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Breakdown of total monthly gross earnings.
              </p>
            </div>
            <div className="kpi-icon-badge gold" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
              <FiPieChart />
            </div>
          </div>

          <div className="category-bars-list">
            {categoryShare.map((cat, idx) => (
              <div key={idx} className="cat-bar-item">
                <div className="cat-bar-top">
                  <span className="cat-bar-title">
                    <span className="cat-bar-dot" style={{ background: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="cat-bar-amt">
                    ₹{cat.revenue.toLocaleString('en-IN')} (<strong>{cat.percent}%</strong>)
                  </span>
                </div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: `${cat.percent}%`,
                      background: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels Preference */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Payment Method Adoption
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Digital UPI vs Card & Counter Cash distribution.
              </p>
            </div>
            <div className="kpi-icon-badge blue" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
              <FiSmartphone />
            </div>
          </div>

          <div className="payment-methods-grid">
            {paymentShare.map((pm, idx) => (
              <div key={idx} className="payment-method-card">
                <div className="pm-top-row">
                  <span className="pm-label">
                    <span style={{ color: pm.color, fontSize: '1.2rem' }}>{pm.icon}</span>
                    {pm.method}
                  </span>
                  <span className="pm-badge-pct" style={{ color: pm.color }}>
                    {pm.share}%
                  </span>
                </div>
                <div className="pm-track">
                  <div
                    className="pm-fill"
                    style={{ width: `${pm.share}%`, background: pm.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RUSH HOURS HEATMAP / TIMELINE */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
              Hourly Brewing Rush & Kitchen Load
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Peak tea times to optimize staff scheduling and inventory preparation.
            </p>
          </div>
          <div className="kpi-icon-badge orange" style={{ width: '38px', height: '38px', fontSize: '1.1rem', background: 'rgba(249, 115, 22, 0.15)', color: '#EA580C' }}>
            <FiClock />
          </div>
        </div>

        <div className="brewing-rush-timeline">
          {rushHours.map((slot, idx) => (
            <div
              key={idx}
              className={`rush-time-slot ${slot.status === 'hot' ? 'peak' : ''}`}
            >
              <div className="rush-slot-title">
                <strong>{slot.title}</strong>
                <span className={`rush-badge-tag ${slot.status}`}>
                  {slot.badge}
                </span>
              </div>
              <div className="rush-time-hours">{slot.time}</div>
              <div className="rush-progress-bar">
                <div
                  className="rush-bar-val"
                  style={{
                    width: `${slot.load * 2}%`,
                    background: slot.status === 'hot' ? '#EF4444' : slot.status === 'warm' ? '#F59E0B' : '#3B82F6',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Kitchen Volume: <strong>{slot.load}% of daily</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
