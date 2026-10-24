import React from 'react';
import { useApp } from '../context/AppContext';
import { FiPlus, FiHeart, FiStar, FiCheck } from 'react-icons/fi';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { state, dispatch, addToast } = useApp();

  const isFavorite = state.favorites.includes(product.id);
  const isInCart = state.cart.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    addToast(`Added ${product.name} to cart ☕`, 'success');
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id });
    addToast(
      isFavorite ? `Removed from wishlist` : `Added ${product.name} to wishlist ❤️`,
      'info'
    );
  };

  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  return (
    <div className="modern-product-card glass-card">
      {/* CARD IMAGE CONTAINER */}
      <div className="card-media-wrapper">
        <img
          src={product.image || '/images/kulhad-chai.jpg'}
          alt={product.name}
          className="card-media-img"
          loading="lazy"
        />

        {product.discount > 0 && (
          <span className="card-badge-discount">{product.discount}% OFF</span>
        )}

        {product.bestseller && (
          <span className="card-badge-bestseller">★ Popular</span>
        )}

        <button
          onClick={handleToggleFavorite}
          className={`card-wishlist-btn ${isFavorite ? 'active' : ''}`}
          aria-label="Wishlist"
        >
          <FiHeart />
        </button>
      </div>

      {/* CARD BODY */}
      <div className="card-content-area">
        <div className="card-meta-top">
          <h3 className="card-product-title">{product.name}</h3>
        </div>

        <div className="card-rating-row">
          <div className="rating-pill">
            <FiStar className="star-icon" />
            <span className="rating-score">{product.rating || '4.8'}</span>
            <span className="rating-reviews-count">({product.reviews || '500+'})</span>
          </div>
          <span className="card-category-text">{product.category?.replace('-', ' ')}</span>
        </div>

        <p className="card-product-desc">{product.description}</p>

        {/* FOOTER: PRICE & QUICK ADD */}
        <div className="card-bottom-row">
          <div className="card-price-stack">
            <span className="card-current-price">₹{discountedPrice}</span>
            {product.discount > 0 && (
              <span className="card-slashed-price">₹{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`card-quick-add-btn ${isInCart ? 'added' : ''}`}
            aria-label="Add to cart"
            title="Add to order"
          >
            {isInCart ? <FiCheck /> : <FiPlus />}
          </button>
        </div>
      </div>
    </div>
  );
}
