import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiHeart, FiStar } from 'react-icons/fi';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { state, dispatch, addToast } = useApp();

  const isFavorite = state.favorites.includes(product.id);
  const cartItem = state.cart.find((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    addToast(`Added ${product.name} to cart ☕`, 'success');
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'UPDATE_QTY',
      payload: { id: product.id, qty: (cartItem?.qty || 0) + 1 },
    });
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (cartItem?.qty <= 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: product.id });
      addToast(`Removed ${product.name} from cart`, 'info');
    } else {
      dispatch({
        type: 'UPDATE_QTY',
        payload: { id: product.id, qty: cartItem.qty - 1 },
      });
    }
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
    <motion.div
      className="modern-product-card glass-card"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
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

        {/* FOOTER: PRICE & QUICK ADD / STEPPER */}
        <div className="card-bottom-row">
          <div className="card-price-stack">
            <span className="card-current-price">₹{discountedPrice}</span>
            {product.discount > 0 && (
              <span className="card-slashed-price">₹{product.price}</span>
            )}
          </div>

          <div className="card-action-container">
            <AnimatePresence mode="wait">
              {cartItem ? (
                <motion.div
                  key="stepper"
                  className="card-qty-stepper"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                >
                  <button
                    onClick={handleDecrement}
                    className="qty-step-btn"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-count">{cartItem.qty}</span>
                  <button
                    onClick={handleIncrement}
                    className="qty-step-btn"
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="add-btn"
                  onClick={handleAddToCart}
                  className="card-quick-add-btn"
                  aria-label="Add to cart"
                  title="Add to order"
                  whileTap={{ scale: 0.88 }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <FiPlus />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
