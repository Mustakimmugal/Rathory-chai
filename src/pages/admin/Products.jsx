import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/appData';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiStar,
  FiPackage,
  FiCheckCircle,
  FiAlertTriangle,
  FiTag,
  FiRefreshCw,
} from 'react-icons/fi';
import './AdminCommon.css';

export default function AdminProducts() {
  const { state, dispatch, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'special-chai',
    discount: '0',
    stock: '50',
    bestseller: false,
    image: '/images/kulhad-chai.jpg',
  });

  // Calculate Metrics
  const totalProducts = state.products.length;
  const inStockCount = state.products.filter((p) => (p.stock ?? 50) > 20).length;
  const lowStockCount = state.products.filter((p) => (p.stock ?? 50) <= 20).length;
  const bestsellersCount = state.products.filter((p) => p.bestseller).length;

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: 'special-chai',
      discount: '0',
      stock: '50',
      bestseller: false,
      image: '/images/special-chai.jpg',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      discount: product.discount || 0,
      stock: product.stock ?? 50,
      bestseller: product.bestseller || false,
      image: product.image || '/images/kulhad-chai.jpg',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from catalog?`)) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      addToast(`Removed ${name}`, 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast('Please enter title and price', 'error');
      return;
    }

    if (editingProduct) {
      const updated = {
        ...editingProduct,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        discount: Number(form.discount),
        stock: Number(form.stock),
        bestseller: form.bestseller,
        image: form.image,
      };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      addToast(`Updated ${form.name}`, 'success');
    } else {
      const newProduct = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        discount: Number(form.discount),
        stock: Number(form.stock),
        bestseller: form.bestseller,
        image: form.image,
        rating: 4.8,
        reviews: 1,
        status: 'active',
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      addToast(`Created new product ${form.name}! ☕`, 'success');
    }

    setIsModalOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCat('all');
    setStockFilter('all');
  };

  // Filtered Products
  const filtered = state.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;

    let matchesStock = true;
    if (stockFilter === 'in-stock') matchesStock = (p.stock ?? 50) > 20;
    else if (stockFilter === 'low-stock') matchesStock = (p.stock ?? 50) <= 20;
    else if (stockFilter === 'bestseller') matchesStock = !!p.bestseller;

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="admin-page">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Management</h1>
          <p className="admin-page-subtitle">Catalog of all handcrafted teas, coffees, beverages & snacks.</p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <FiPlus /> Add New Delicacy
        </button>
      </div>

      {/* KPI METRICS ROW */}
      <div className="admin-stats-row">
        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico gold">
            <FiPackage />
          </div>
          <div>
            <div className="admin-stat-val">{totalProducts}</div>
            <div className="admin-stat-lbl">Total Delicacies</div>
          </div>
        </div>

        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico green">
            <FiCheckCircle />
          </div>
          <div>
            <div className="admin-stat-val">{inStockCount}</div>
            <div className="admin-stat-lbl">In Good Stock</div>
          </div>
        </div>

        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico rose">
            <FiAlertTriangle />
          </div>
          <div>
            <div className="admin-stat-val">{lowStockCount}</div>
            <div className="admin-stat-lbl">Low Stock Alert</div>
          </div>
        </div>

        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico blue">
            <FiStar />
          </div>
          <div>
            <div className="admin-stat-val">{bestsellersCount}</div>
            <div className="admin-stat-lbl">Royal Picks</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="admin-card admin-controls-bar">
        <div className="admin-search-input-wrap">
          <FiSearch />
          <input
            type="text"
            placeholder="Search delicacies by title, flavor, or description..."
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
          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Categories ({state.products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock ({inStockCount})</option>
            <option value="low-stock">Low Stock ({lowStockCount})</option>
            <option value="bestseller">Royal Picks ({bestsellersCount})</option>
          </select>

          {(search || selectedCat !== 'all' || stockFilter !== 'all') && (
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

      {/* PRODUCTS TABLE */}
      <div className="admin-card admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Delicacy Item</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '12%' }}>Price</th>
                <th style={{ width: '10%' }}>Discount</th>
                <th style={{ width: '12%' }}>Stock Status</th>
                <th style={{ width: '10%' }}>Highlight</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-state">
                      <div className="empty-state-icon">☕</div>
                      <h4>No products match your criteria</h4>
                      <p>Try searching with another keyword or resetting the category filter.</p>
                      <button onClick={resetFilters} className="btn btn-primary btn-sm">
                        Show All Products
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div className="table-product-cell">
                        <img src={prod.image} alt={prod.name} className="table-prod-thumb" />
                        <div className="table-prod-info">
                          <strong>{prod.name}</strong>
                          <p className="table-prod-desc">{prod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cat-badge">{prod.category?.replace('-', ' ')}</span>
                    </td>
                    <td>
                      <strong className="table-price">₹{prod.price}</strong>
                    </td>
                    <td>
                      {prod.discount > 0 ? (
                        <span className="discount-pill">{prod.discount}% OFF</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      {(prod.stock ?? 50) <= 20 ? (
                        <span className="stock-pill low">Low ({prod.stock ?? 50})</span>
                      ) : (
                        <span className="stock-pill good">In Stock ({prod.stock ?? 50})</span>
                      )}
                    </td>
                    <td>
                      {prod.bestseller ? (
                        <span className="bestseller-badge">★ Royal Pick</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div className="table-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn-tbl-action"
                          title="Edit Delicacy"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="btn-tbl-action delete"
                          title="Delete Delicacy"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Delicacy' : 'Add New Delicacy'}</h3>
              <button
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Elaichi Chai"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description & Flavor Profile</label>
                <textarea
                  rows="2"
                  placeholder="Ingredients, brewing style, and tasting notes..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    placeholder="0"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div className="product-image-preview-box">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="modal-img-preview"
                    onError={(e) => {
                      e.target.src = '/images/kulhad-chai.jpg';
                    }}
                  />
                  <div className="image-select-control">
                    <select
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    >
                      <option value="/images/special-chai.jpg">Royal Saffron Chai</option>
                      <option value="/images/masala-chai.jpg">Heritage Masala Chai</option>
                      <option value="/images/kulhad-chai.jpg">Baked Kulhad Chai</option>
                      <option value="/images/coffee.jpg">Artisan Coffee / Cappuccino</option>
                      <option value="/images/hero-bg.jpg">Cafe Ambience / Snacks</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.bestseller}
                    onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                  />
                  <span>Mark as Bestseller / Royal Pick ★</span>
                </label>
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
                  <FiCheck /> {editingProduct ? 'Save Changes' : 'Create Delicacy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
