import React, { useState } from 'react';
import { galleryImages } from '../../data/appData';
import { useApp } from '../../context/AppContext';
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiImage,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiLayers,
  FiEye,
} from 'react-icons/fi';
import './AdminCommon.css';

export default function AdminGalleryMgmt() {
  const { addToast } = useApp();
  const [images, setImages] = useState(galleryImages);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'cafe',
    src: '/images/hero-bg.jpg',
  });

  const categories = [
    { id: 'cafe', name: 'Cafe Ambience' },
    { id: 'products', name: 'Artisanal Teas' },
    { id: 'process', name: 'The Brewing Craft' },
    { id: 'events', name: 'Royal Events' },
  ];

  const totalPhotos = images.length;
  const categoriesCount = new Set(images.map((img) => img.category)).size;

  const openAddModal = () => {
    setEditingImage(null);
    setForm({
      title: '',
      category: 'cafe',
      src: '/images/hero-bg.jpg',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setForm({
      title: img.title,
      category: img.category,
      src: img.src,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from showcase?`)) {
      setImages(images.filter((img) => img.id !== id));
      addToast(`Removed "${title}" from showcase`, 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) {
      addToast('Please enter a photo title', 'error');
      return;
    }

    if (editingImage) {
      setImages(
        images.map((img) =>
          img.id === editingImage.id ? { ...img, ...form } : img
        )
      );
      addToast(`Updated "${form.title}"! 📸`, 'success');
    } else {
      const item = {
        id: Date.now(),
        ...form,
      };
      setImages([item, ...images]);
      addToast(`Added "${form.title}" to showcase! 📸`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || img.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-page">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gallery & Showcase Management</h1>
          <p className="admin-page-subtitle">
            Curate photo moments of earthen kulhads, brass kettles, brewing artistry, and customer gatherings.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <FiPlus /> Add Photo to Showcase
        </button>
      </div>

      {/* KPI METRICS ROW */}
      <div className="admin-stats-row">
        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico gold">
            <FiImage />
          </div>
          <div>
            <div className="admin-stat-val">{totalPhotos}</div>
            <div className="admin-stat-lbl">Showcase Moments</div>
          </div>
        </div>

        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico blue">
            <FiLayers />
          </div>
          <div>
            <div className="admin-stat-val">{categoriesCount}</div>
            <div className="admin-stat-lbl">Visual Themes</div>
          </div>
        </div>

        <div className="admin-stat-badge-card">
          <div className="admin-stat-ico green">
            <FiEye />
          </div>
          <div>
            <div className="admin-stat-val">Live</div>
            <div className="admin-stat-lbl">Public Showcase</div>
          </div>
        </div>
      </div>

      {/* CONTROLS & FILTER BAR */}
      <div className="admin-card admin-controls-bar">
        <div className="admin-search-input-wrap">
          <FiSearch />
          <input
            type="text"
            placeholder="Search moments by title..."
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

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Themes ({images.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GALLERY GRID */}
      {filteredImages.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h4>No gallery photos found</h4>
            <p>Try searching for a different moment or change your theme filter.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCat('all'); }}
              className="btn btn-primary btn-sm"
            >
              Show All Photos
            </button>
          </div>
        </div>
      ) : (
        <div className="gallery-admin-grid">
          {filteredImages.map((img) => (
            <div key={img.id} className="gallery-admin-card">
              <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                <img
                  src={img.src}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/kulhad-chai.jpg';
                  }}
                />
                <span
                  className="cat-badge"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#38BDF8',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {img.category}
                </span>
              </div>

              <div className="gallery-admin-meta">
                <div>
                  <strong style={{ fontSize: '0.94rem' }}>{img.title}</strong>
                </div>

                <div className="table-row-actions">
                  <button
                    onClick={() => openEditModal(img)}
                    className="btn-tbl-action"
                    title="Edit Photo Info"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, img.title)}
                    className="btn-tbl-action delete"
                    title="Remove Photo"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingImage ? 'Edit Photo Showcase' : 'Add Gallery Photo'}</h3>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="form-group">
                <label>Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Tea Master at Sunrise"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Visual Theme / Category</label>
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
                <label>Photo Asset Preview</label>
                <div className="product-image-preview-box">
                  <img
                    src={form.src}
                    alt="Preview"
                    className="modal-img-preview"
                    onError={(e) => {
                      e.target.src = '/images/kulhad-chai.jpg';
                    }}
                  />
                  <div className="image-select-control">
                    <select
                      value={form.src}
                      onChange={(e) => setForm({ ...form, src: e.target.value })}
                    >
                      <option value="/images/hero-bg.jpg">Cafe Ambience & Lounge</option>
                      <option value="/images/special-chai.jpg">Royal Saffron Chai</option>
                      <option value="/images/masala-chai.jpg">Steaming Masala Chai</option>
                      <option value="/images/kulhad-chai.jpg">Traditional Clay Kulhad</option>
                      <option value="/images/coffee.jpg">Artisan Coffee / Cappuccino</option>
                    </select>
                  </div>
                </div>
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
                  <FiCheck /> {editingImage ? 'Save Changes' : 'Add to Showcase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
