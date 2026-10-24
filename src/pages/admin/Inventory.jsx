import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FiArchive,
  FiAlertTriangle,
  FiPlus,
  FiRefreshCw,
  FiCheck,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiPackage,
  FiTrendingUp,
} from 'react-icons/fi';
import './AdminCommon.css';

export default function AdminInventory() {
  const { addToast } = useApp();

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Baked Terracotta Kulhads (Organic Clay)',
      category: 'Packaging',
      stock: 450,
      minLevel: 200,
      unit: 'Pieces',
      icon: '🏺',
      supplier: 'Local Potter Guild, Sikar',
      status: 'optimal',
    },
    {
      id: 2,
      name: 'Kashmiri Mogra Saffron (Pampore Grade-A)',
      category: 'Raw Spices',
      stock: 15,
      minLevel: 20,
      unit: 'Grams',
      icon: '✨',
      supplier: 'Pampore Saffron Co-op',
      status: 'low',
    },
    {
      id: 3,
      name: 'Assam Golden Tip CTC & Whole Leaf Blend',
      category: 'Tea Base',
      stock: 68,
      minLevel: 25,
      unit: 'Kilograms',
      icon: '🍃',
      supplier: 'Upper Assam Estate',
      status: 'optimal',
    },
    {
      id: 4,
      name: 'Taaza Idukki Green Cardamom Pods',
      category: 'Raw Spices',
      stock: 8,
      minLevel: 15,
      unit: 'Kilograms',
      icon: '🌿',
      supplier: 'Kerala Spice Board Direct',
      status: 'low',
    },
    {
      id: 5,
      name: 'Fresh Buffalo Full-Cream Milk',
      category: 'Dairy',
      stock: 120,
      minLevel: 40,
      unit: 'Liters',
      icon: '🥛',
      supplier: 'Sikar Local Dairy Farms',
      status: 'optimal',
    },
    {
      id: 6,
      name: 'Thermal Insulated Takeaway Flasks (500ml)',
      category: 'Packaging',
      stock: 180,
      minLevel: 50,
      unit: 'Flasks',
      icon: '☕',
      supplier: 'EcoCraft Packaging',
      status: 'optimal',
    },
    {
      id: 7,
      name: 'Wayanad Fresh Crushed Ginger Roots',
      category: 'Raw Spices',
      stock: 32,
      minLevel: 15,
      unit: 'Kilograms',
      icon: '🫚',
      supplier: 'AgriFresh Wholesale',
      status: 'optimal',
    },
    {
      id: 8,
      name: 'Organic Royal Palm Jaggery (Desi Gur)',
      category: 'Sweetener',
      stock: 24,
      minLevel: 10,
      unit: 'Kilograms',
      icon: '🍯',
      supplier: 'Organic Desi Khand Mills',
      status: 'optimal',
    },
  ]);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [customRestockItem, setCustomRestockItem] = useState(null);
  const [customRestockQty, setCustomRestockQty] = useState('50');

  const [form, setForm] = useState({
    name: '',
    category: 'Raw Spices',
    stock: '',
    minLevel: '',
    unit: 'Kilograms',
    icon: '🌿',
    supplier: '',
  });

  const categories = ['Packaging', 'Raw Spices', 'Tea Base', 'Dairy', 'Sweetener'];

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Packaging': return '🏺';
      case 'Raw Spices': return '🌿';
      case 'Tea Base': return '🍃';
      case 'Dairy': return '🥛';
      case 'Sweetener': return '🍯';
      default: return '📦';
    }
  };

  // Metrics
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter((i) => i.status === 'low');
  const lowStockCount = lowStockItems.length;
  const optimalCount = totalItems - lowStockCount;
  const totalUnitsSum = inventoryItems.reduce((acc, curr) => acc + curr.stock, 0);

  // Quick Restock
  const handleRestock = (id, amount) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = item.stock + amount;
          return {
            ...item,
            stock: newStock,
            status: newStock <= item.minLevel ? 'low' : 'optimal',
          };
        }
        return item;
      })
    );
    addToast(`Restocked +${amount} units successfully! 📦`, 'success');
  };

  // Restock All Low Stock
  const handleRestockAllLow = () => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.status === 'low') {
          const replenishment = item.minLevel * 2 - item.stock;
          return {
            ...item,
            stock: item.stock + replenishment,
            status: 'optimal',
          };
        }
        return item;
      })
    );
    addToast('All low-stock items have been safely replenished! 🌿', 'success');
  };

  // Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      setInventoryItems((prev) => prev.filter((i) => i.id !== id));
      addToast(`Removed ${name}`, 'info');
    }
  };

  // Open Add / Edit Modal
  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      name: '',
      category: 'Raw Spices',
      stock: '50',
      minLevel: '20',
      unit: 'Kilograms',
      icon: '🌿',
      supplier: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      minLevel: item.minLevel,
      unit: item.unit,
      icon: item.icon || getCategoryIcon(item.category),
      supplier: item.supplier || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.stock) {
      addToast('Please enter material name and stock level', 'error');
      return;
    }

    const stockNum = Number(form.stock);
    const minNum = Number(form.minLevel) || 10;
    const computedStatus = stockNum <= minNum ? 'low' : 'optimal';

    if (editingItem) {
      setInventoryItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name: form.name,
                category: form.category,
                stock: stockNum,
                minLevel: minNum,
                unit: form.unit,
                icon: form.icon || getCategoryIcon(form.category),
                supplier: form.supplier,
                status: computedStatus,
              }
            : i
        )
      );
      addToast(`Updated ${form.name}`, 'success');
    } else {
      const newItem = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        stock: stockNum,
        minLevel: minNum,
        unit: form.unit,
        icon: form.icon || getCategoryIcon(form.category),
        supplier: form.supplier,
        status: computedStatus,
      };
      setInventoryItems((prev) => [newItem, ...prev]);
      addToast(`Added new raw material ${form.name}! 📦`, 'success');
    }

    setIsModalOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCat('all');
    setStatusFilter('all');
  };

  // Filtered List
  const filtered = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="admin-page">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory & Raw Materials</h1>
          <p className="admin-page-subtitle">
            Manage earthen kulhads, organic spices, single-origin tea reserves, and packaging.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <FiPlus /> Add Raw Material
        </button>
      </div>

      {/* TOP KPI CARDS */}
      <div className="admin-stats-row">
        <div
          onClick={() => setStatusFilter('all')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'all' ? 'active' : ''}`}
          title="Click to view all materials"
        >
          <div className="admin-stat-ico blue">
            <FiArchive />
          </div>
          <div>
            <div className="admin-stat-val">{totalItems}</div>
            <div className="admin-stat-lbl">Tracked Supplies</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('low')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'low' ? 'active' : ''}`}
          title="Click to view low stock alerts"
        >
          <div className="admin-stat-ico rose">
            <FiAlertTriangle />
          </div>
          <div>
            <div className="admin-stat-val">{lowStockCount}</div>
            <div className="admin-stat-lbl">Low Stock Alerts</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('optimal')}
          className={`admin-stat-badge-card interactive ${statusFilter === 'optimal' ? 'active' : ''}`}
          title="Click to view optimal stock items"
        >
          <div className="admin-stat-ico green">
            <FiCheckCircle />
          </div>
          <div>
            <div className="admin-stat-val">{optimalCount}</div>
            <div className="admin-stat-lbl">Sufficient Stock</div>
          </div>
        </div>

        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico gold">
            <FiPackage />
          </div>
          <div>
            <div className="admin-stat-val">{totalUnitsSum.toLocaleString('en-IN')}</div>
            <div className="admin-stat-lbl">Total Units in Stock</div>
          </div>
        </div>
      </div>

      {/* LOW STOCK CRITICAL WARNING BANNER */}
      {lowStockCount > 0 && (
        <div className="inventory-alert-banner">
          <FiAlertTriangle className="alert-icon" />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              Attention: {lowStockCount} Raw Material(s) Below Minimum Safety Level
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Essential spices or kulhads are running low. Restock now to prevent kitchen delays during peak hours.
            </p>
          </div>
          <button
            onClick={handleRestockAllLow}
            className="btn btn-primary btn-sm"
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw /> Auto Replenish All
          </button>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="admin-card admin-controls-bar">
        <div className="admin-search-input-wrap">
          <FiSearch />
          <input
            type="text"
            placeholder="Search material, tea type, or supplier..."
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

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Categories ({inventoryItems.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="orders-status-tabs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`order-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              <span>All</span>
              <span className="tab-count-badge">{totalItems}</span>
            </button>
            <button
              onClick={() => setStatusFilter('low')}
              className={`order-tab-btn ${statusFilter === 'low' ? 'active' : ''}`}
            >
              <span>Low Stock</span>
              <span className="tab-count-badge" style={{ color: '#EF4444' }}>{lowStockCount}</span>
            </button>
            <button
              onClick={() => setStatusFilter('optimal')}
              className={`order-tab-btn ${statusFilter === 'optimal' ? 'active' : ''}`}
            >
              <span>Optimal</span>
              <span className="tab-count-badge" style={{ color: '#16A34A' }}>{optimalCount}</span>
            </button>
          </div>

          {(search || selectedCat !== 'all' || statusFilter !== 'all') && (
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

      {/* INVENTORY TABLE */}
      <div className="admin-card admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '32%' }}>Material / Item</th>
                <th style={{ width: '14%' }}>Category</th>
                <th style={{ width: '16%' }}>Current Stock</th>
                <th style={{ width: '12%' }}>Safety Min</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '14%' }}>Quick Restock</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-state">
                      <div className="empty-state-icon">📦</div>
                      <h4>No inventory materials found</h4>
                      <p>Try searching for a different item or clear your active filters.</p>
                      <button onClick={resetFilters} className="btn btn-primary btn-sm">
                        View All Inventory
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const percentOfOptimal = Math.min(
                    100,
                    Math.round((item.stock / (item.minLevel * 2 || 1)) * 100)
                  );

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="material-name-cell">
                          <div className="material-ico-badge">
                            {item.icon || getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)', display: 'block' }}>
                              {item.name}
                            </strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Supplier: {item.supplier || 'Standard Procurement'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="cat-badge">{item.category}</span>
                      </td>
                      <td>
                        <strong
                          style={{
                            fontFamily: 'Outfit',
                            fontSize: '1.15rem',
                            color: item.status === 'low' ? '#EF4444' : 'var(--text-primary)',
                          }}
                        >
                          {item.stock} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.unit}</span>
                        </strong>
                        <div className="inventory-level-bar">
                          <div
                            className={`inventory-level-fill ${item.status}`}
                            style={{ width: `${percentOfOptimal}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          {item.minLevel} {item.unit}
                        </span>
                      </td>
                      <td>
                        {item.status === 'low' ? (
                          <span className="stock-pill low">⚠️ Low Stock</span>
                        ) : (
                          <span className="stock-pill good">✓ Sufficient</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleRestock(item.id, 25)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                            title="Add 25 units"
                          >
                            +25
                          </button>
                          <button
                            onClick={() => handleRestock(item.id, 100)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                            title="Add 100 units"
                          >
                            +100
                          </button>
                          <button
                            onClick={() => {
                              setCustomRestockItem(item);
                              setCustomRestockQty('50');
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                            title="Custom quantity"
                          >
                            Add
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-row-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openEditModal(item)}
                            className="btn-tbl-action"
                            title="Edit Material"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="btn-tbl-action delete"
                            title="Delete Material"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MATERIAL MODAL */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingItem ? 'Edit Raw Material' : 'Add New Raw Material'}</h3>
              <button
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Saffron or Terracotta Kulhad"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit of Measurement</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  >
                    <option value="Kilograms">Kilograms (kg)</option>
                    <option value="Grams">Grams (g)</option>
                    <option value="Liters">Liters (L)</option>
                    <option value="Pieces">Pieces (Kulhad / Boxes)</option>
                    <option value="Flasks">Flasks</option>
                    <option value="Packets">Packets</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Current Stock Level *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 100"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Safety Min Threshold *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 25"
                    value={form.minLevel}
                    onChange={(e) => setForm({ ...form, minLevel: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Supplier / Sourcing Source</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Mills, Sikar"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-dark btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <FiCheck /> {editingItem ? 'Save Changes' : 'Create Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM RESTOCK MODAL */}
      {customRestockItem && (
        <div className="admin-modal-backdrop" onClick={() => setCustomRestockItem(null)}>
          <div className="admin-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>Restock {customRestockItem.name}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Current Stock: {customRestockItem.stock} {customRestockItem.unit}
                </span>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setCustomRestockItem(null)}
              >
                <FiX />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '0.5rem' }}>
              <div className="form-group">
                <label>Add Quantity ({customRestockItem.unit})</label>
                <input
                  type="number"
                  min="1"
                  value={customRestockQty}
                  onChange={(e) => setCustomRestockQty(e.target.value)}
                  style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[10, 25, 50, 100, 250].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCustomRestockQty(num.toString())}
                    className="order-tab-btn"
                    style={{ flex: 1, padding: '6px 0', justifyContent: 'center' }}
                  >
                    +{num}
                  </button>
                ))}
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setCustomRestockItem(null)}
                  className="btn btn-dark btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const addAmount = Number(customRestockQty) || 0;
                    if (addAmount > 0) {
                      handleRestock(customRestockItem.id, addAmount);
                    }
                    setCustomRestockItem(null);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiCheck /> Confirm Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
