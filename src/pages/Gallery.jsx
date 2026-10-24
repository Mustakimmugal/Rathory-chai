import React, { useState } from 'react';
import { galleryImages } from '../data/appData';
import { useApp } from '../context/AppContext';
import {
  FiZoomIn,
  FiX,
  FiTag,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiMaximize2,
} from 'react-icons/fi';
import './Gallery.css';

export default function Gallery() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Likes state
  const [likes, setLikes] = useState({
    1: 142,
    2: 98,
    3: 176,
    4: 85,
    5: 210,
    6: 119,
    7: 154,
    8: 88,
  });
  const [userLiked, setUserLiked] = useState({});

  const categories = [
    { id: 'all', label: 'All Moments' },
    { id: 'cafe', label: 'Cafe Ambience' },
    { id: 'products', label: 'Artisanal Teas' },
    { id: 'process', label: 'The Brewing Craft' },
    { id: 'events', label: 'Royal Events' },
  ];

  const handleLike = (e, imgId) => {
    e.stopPropagation();
    const isLiked = !!userLiked[imgId];
    setUserLiked((prev) => ({ ...prev, [imgId]: !isLiked }));
    setLikes((prev) => ({
      ...prev,
      [imgId]: (prev[imgId] || 0) + (isLiked ? -1 : 1),
    }));
    if (!isLiked) {
      addToast('Liked this moment! ❤️', 'success');
    }
  };

  const handleShare = (e, img) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    addToast(`Link to "${img.title}" copied to clipboard! 📋`, 'info');
  };

  const filteredImages =
    activeTab === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  // Lightbox navigation
  const openLightbox = (img) => {
    const idx = filteredImages.findIndex((item) => item.id === img.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const currentLightboxImg =
    lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div className="gallery-page">
      {/* HEADER */}
      <div className="gallery-header">
        <div className="container">
          <span className="section-subtitle">Visual Splendor</span>
          <h1 className="section-title">The Rathory Chai Showcase</h1>
          <div className="gold-line"></div>
          <p className="section-desc">
            A celebration of glowing brass kettles, terracotta kulhads, authentic Sikar cafe
            moments, and tea brewed with royal heritage and devotion.
          </p>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: '1rem' }}>
        {/* TABS WITH COUNTS */}
        <div className="gallery-tabs">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? galleryImages.length
                : galleryImages.filter((img) => img.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`gallery-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
              >
                <span>{cat.label}</span>
                <span className="gallery-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* IMAGE MASONRY / BENTO GRID */}
        <div className="gallery-masonry-grid">
          {filteredImages.map((img) => {
            const isLiked = !!userLiked[img.id];
            const likeCount = likes[img.id] || 0;

            return (
              <div
                key={img.id}
                className="gallery-card"
                onClick={() => openLightbox(img)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="gallery-thumb"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/images/kulhad-chai.jpg';
                  }}
                />

                {/* Card Top Actions: Like & Share */}
                <div className="gallery-top-actions">
                  <button
                    onClick={(e) => handleLike(e, img.id)}
                    className={`gallery-action-btn ${isLiked ? 'liked' : ''}`}
                    title="Like photo"
                  >
                    <FiHeart className={isLiked ? 'heart-filled' : ''} />
                    <span>{likeCount}</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(e, img)}
                    className="gallery-action-btn"
                    title="Share photo"
                  >
                    <FiShare2 />
                  </button>
                </div>

                {/* Card Bottom Overlay */}
                <div className="gallery-card-overlay">
                  <span className="gallery-category-pill">
                    <FiTag /> {img.category}
                  </span>
                  <h4 className="gallery-img-title">{img.title}</h4>
                  <div className="gallery-zoom-icon" title="View Fullscreen">
                    <FiMaximize2 />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WITH NEXT/PREV */}
      {currentLightboxImg && (
        <div className="lightbox-backdrop" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="lightbox-close-btn"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close image"
            >
              <FiX />
            </button>

            {/* Navigation Arrows */}
            {filteredImages.length > 1 && (
              <>
                <button
                  className="lightbox-nav-btn prev"
                  onClick={prevImage}
                  title="Previous Photo"
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="lightbox-nav-btn next"
                  onClick={nextImage}
                  title="Next Photo"
                >
                  <FiChevronRight />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="lightbox-img-wrapper">
              <img
                src={currentLightboxImg.src}
                alt={currentLightboxImg.title}
                className="lightbox-img"
              />
            </div>

            {/* Caption & Controls */}
            <div className="lightbox-caption">
              <div>
                <h3>{currentLightboxImg.title}</h3>
                <span className="lightbox-category">
                  Category: {currentLightboxImg.category} • Photo {lightboxIndex + 1} of{' '}
                  {filteredImages.length}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={(e) => handleLike(e, currentLightboxImg.id)}
                  className={`btn btn-sm ${
                    userLiked[currentLightboxImg.id] ? 'btn-primary' : 'btn-dark'
                  }`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiHeart />
                  <span>{likes[currentLightboxImg.id] || 0} Likes</span>
                </button>

                <button
                  onClick={(e) => handleShare(e, currentLightboxImg)}
                  className="btn btn-dark btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiShare2 />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
