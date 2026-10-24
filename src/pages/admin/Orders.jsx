import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FiSearch,
  FiEye,
  FiX,
  FiPrinter,
  FiShoppingBag,
  FiClock,
  FiCoffee,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiCheck,
  FiRefreshCw,
} from 'react-icons/fi';
import './AdminCommon.css';

export default function AdminOrders() {
  const { state, dispatch, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Counts
  const totalOrders = state.orders.length;
  const pendingCount = state.orders.filter((o) => o.orderStatus === 'pending').length;
  const confirmedCount = state.orders.filter((o) => o.orderStatus === 'confirmed').length;
  const preparingCount = state.orders.filter((o) => o.orderStatus === 'preparing').length;
  const outForDeliveryCount = state.orders.filter((o) => o.orderStatus === 'out-for-delivery').length;
  const completedCount = state.orders.filter((o) => o.orderStatus === 'completed').length;
  const cancelledCount = state.orders.filter((o) => o.orderStatus === 'cancelled').length;

  const handleStatusChange = (orderId, newStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: newStatus } });
    addToast(`Order ${orderId} updated to ${newStatus.replace('-', ' ')} ☕`, 'success');
  };

  const statusTabs = [
    { id: 'all', label: 'All Orders', count: totalOrders },
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
    { id: 'preparing', label: 'Brewing', count: preparingCount },
    { id: 'out-for-delivery', label: 'Out for Delivery', count: outForDeliveryCount },
    { id: 'completed', label: 'Completed', count: completedCount },
    { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
  ];

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  const filteredOrders = state.orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.includes(search);

    const matchesStatus =
      statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Live Orders Board</h1>
          <p className="admin-page-subtitle">Track, update, and dispatch orders in real-time across all cafe channels.</p>
        </div>
      </div>

      {/* LIVE ORDERS BOARD STATUS BOXES (CLICKABLE KPI CARDS) */}
      <div className="admin-stats-row">
        <div
          onClick={() => setStatusFilter('all')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'all' ? 'active' : ''}`}
          title="Click to view all orders"
        >
          <div className="admin-stat-ico blue">
            <FiShoppingBag />
          </div>
          <div>
            <div className="admin-stat-val">{totalOrders}</div>
            <div className="admin-stat-lbl">Total Orders</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'pending' ? 'active' : ''}`}
          title="Click to view pending orders"
        >
          <div className="admin-stat-ico gold">
            <FiClock />
          </div>
          <div>
            <div className="admin-stat-val">{pendingCount}</div>
            <div className="admin-stat-lbl">Pending Orders</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('preparing')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'preparing' ? 'active' : ''}`}
          title="Click to view orders brewing in kitchen"
        >
          <div className="admin-stat-ico orange" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#EA580C' }}>
            <FiCoffee />
          </div>
          <div>
            <div className="admin-stat-val">{preparingCount}</div>
            <div className="admin-stat-lbl">In Kitchen / Brewing</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('out-for-delivery')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'out-for-delivery' ? 'active' : ''}`}
          title="Click to view out for delivery"
        >
          <div className="admin-stat-ico purple" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#7C3AED' }}>
            <FiTruck />
          </div>
          <div>
            <div className="admin-stat-val">{outForDeliveryCount}</div>
            <div className="admin-stat-lbl">Out for Delivery</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('completed')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'completed' ? 'active' : ''}`}
          title="Click to view completed orders"
        >
          <div className="admin-stat-ico green">
            <FiCheckCircle />
          </div>
          <div>
            <div className="admin-stat-val">{completedCount}</div>
            <div className="admin-stat-lbl">Completed</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('cancelled')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'cancelled' ? 'active' : ''}`}
          title="Click to view cancelled orders"
        >
          <div className="admin-stat-ico rose">
            <FiXCircle />
          </div>
          <div>
            <div className="admin-stat-val">{cancelledCount}</div>
            <div className="admin-stat-lbl">Cancelled</div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="admin-card admin-controls-bar">
        <div className="admin-search-input-wrap">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by order ID, customer name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="orders-status-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`order-tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              <span className="tab-count-badge">{tab.count}</span>
            </button>
          ))}

          {(search || statusFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="btn btn-dark btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Reset Filters"
            >
              <FiRefreshCw />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="admin-card admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Order ID</th>
                <th style={{ width: '10%' }}>Time</th>
                <th style={{ width: '18%' }}>Customer</th>
                <th style={{ width: '22%' }}>Items Summary</th>
                <th style={{ width: '10%' }}>Amount</th>
                <th style={{ width: '10%' }}>Payment</th>
                <th style={{ width: '12%' }}>Live Status</th>
                <th style={{ width: '15%' }}>Change Status</th>
                <th style={{ width: '5%', textAlign: 'right' }}>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="admin-empty-state">
                      <div className="empty-state-icon">📋</div>
                      <h4>No orders found</h4>
                      <p>There are no orders matching the selected status or search query.</p>
                      <button onClick={resetFilters} className="btn btn-primary btn-sm">
                        View All Orders
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="table-order-id">#{order.id}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td>
                      <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {order.customerName}
                      </strong>
                      <div className="table-sub-text">{order.phone}</div>
                    </td>
                    <td>
                      <div className="table-items-summary">
                        {order.items?.map((it, idx) => (
                          <span key={idx} className="table-item-tag">
                            {it.qty}x {it.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong className="table-price">₹{order.total}</strong>
                    </td>
                    <td>
                      <span className={`table-badge ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${order.orderStatus}`}>
                        {order.orderStatus.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="table-status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Brewing</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-tbl-action"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-box order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>Order #{selectedOrder.id} Summary</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="order-detail-body">
              <div className="detail-meta-grid">
                <div>
                  <strong>Customer:</strong>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <strong>Contact:</strong>
                  <p>{selectedOrder.phone}</p>
                </div>
                <div>
                  <strong>Payment:</strong>
                  <p>{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus.toUpperCase()})</p>
                </div>
                <div>
                  <strong>Delivery Address:</strong>
                  <p>{selectedOrder.address}</p>
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className="instructions-badge">
                  <strong>Special Brewing Notes:</strong> {selectedOrder.specialInstructions}
                </div>
              )}

              <div className="modal-items-breakdown">
                <h4>Items Ordered</h4>
                <div className="modal-items-list">
                  {selectedOrder.items?.map((it, i) => (
                    <div key={i} className="modal-item-line">
                      <div>
                        <strong>{it.qty}x</strong> {it.name}
                      </div>
                      <span>₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="modal-total-line">
                  <span>Grand Total:</span>
                  <strong>₹{selectedOrder.total}</strong>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-dark btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiPrinter /> Print Kitchen Ticket
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'completed');
                    setSelectedOrder(null);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiCheck /> Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
