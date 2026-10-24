import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FiSearch, FiMail, FiPhone, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import './AdminCommon.css';

export default function AdminCustomers() {
  const { state } = useApp();
  const [search, setSearch] = useState('');

  const filteredCustomers = state.customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Patrons & Customers</h1>
          <p className="admin-page-subtitle">Directory of registered chai lovers and royal membership profiles.</p>
        </div>
      </div>

      <div className="admin-card admin-controls-bar">
        <div className="admin-search-input-wrap">
          <FiSearch />
          <input
            type="text"
            placeholder="Search patron by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patron</th>
                <th>Contact</th>
                <th>Default Address</th>
                <th>Total Orders</th>
                <th>Lifetime Spent</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="table-product-cell">
                      <div className="customer-avatar-box">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <strong>{c.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>
                          ID: #{c.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      <div><FiPhone style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {c.phone}</div>
                      <div className="text-muted"><FiMail style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {c.email}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {c.address}
                    </span>
                  </td>
                  <td>
                    <strong>{c.totalOrders} orders</strong>
                  </td>
                  <td>
                    <strong className="table-price">₹{c.totalSpent.toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className="text-muted">{c.joinedAt}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${c.status === 'active' ? 'completed' : 'cancelled'}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
