import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag, FiTag, FiCheck } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const { state, dispatch, addToast } = useApp();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const cart = state.cart;
  const subtotal = state.cartTotal;

  // Coupon application logic
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (code === 'CHAI10') {
      const discountVal = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: 'CHAI10', discount: discountVal, label: '10% Royal Privilege Discount' });
      addToast('Coupon CHAI10 applied! 10% discount granted ✨', 'success');
    } else if (code === 'ROYAL50') {
      const discountVal = Math.min(50, subtotal);
      setAppliedCoupon({ code: 'ROYAL50', discount: discountVal, label: '₹50 Flat Celebration Discount' });
      addToast('Coupon ROYAL50 applied! ₹50 discount granted ☕', 'success');
    } else {
      addToast('Invalid coupon code. Try CHAI10 or ROYAL50', 'error');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee = subtotal >= 299 || subtotal === 0 ? 0 : 35;
  const taxes = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + taxes);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }
    // Store instructions & coupon in sessionStorage or pass via navigation state
    sessionStorage.setItem('rathory_order_meta', JSON.stringify({
      appliedCoupon,
      specialInstructions,
      grandTotal,
      taxes,
      deliveryFee,
    }));
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart-wrapper">
        <div className="container">
          <div className="empty-cart-card">
            <div className="empty-cart-icon">🏺</div>
            <h2>Your Royal Kulhad Is Empty</h2>
            <p>You haven't added any aromatic teas or savory snacks to your order yet.</p>
            <Link to="/menu" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <span>Explore The Menu</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="container">
          <span className="section-subtitle">Review Your Order</span>
          <h1 className="section-title">Royal Shopping Cart</h1>
          <div className="gold-line"></div>
        </div>
      </div>

      <div className="container section">
        <div className="cart-layout-grid">
          {/* ITEMS LIST */}
          <div className="cart-items-column">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => {
                const effectivePrice = item.discount
                  ? Math.round(item.price - (item.price * item.discount) / 100)
                  : item.price;
                const itemTotal = effectivePrice * item.qty;

                return (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-info">
                      <img
                        src={item.image || '/images/kulhad-chai.jpg'}
                        alt={item.name}
                        className="cart-item-thumb"
                      />
                      <div>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-cat">{item.category?.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <div className="cart-item-unit-price">
                      ₹{effectivePrice}
                    </div>

                    <div className="cart-item-qty-ctrl">
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty - 1 } })}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span className="qty-number">{item.qty}</span>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="cart-item-total-price">
                      ₹{itemTotal}
                    </div>

                    <button
                      onClick={() => {
                        dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
                        addToast(`Removed ${item.name}`, 'info');
                      }}
                      className="cart-item-remove-btn"
                      aria-label="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* SPECIAL INSTRUCTIONS */}
            <div className="cart-instructions-card">
              <label>Special Preparation Notes (e.g., Less sugar, extra cardamom, clay kulhad pack):</label>
              <textarea
                rows="2"
                placeholder="Write any instructions for our tea master..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h3 className="summary-title">Bill Breakdown</h3>

              {/* COUPON INPUT */}
              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <div className="coupon-input-wrapper">
                  <FiTag className="coupon-icon" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. CHAI10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                </div>
                {appliedCoupon ? (
                  <button type="button" onClick={removeCoupon} className="btn-remove-coupon">
                    Remove
                  </button>
                ) : (
                  <button type="submit" className="btn-apply-coupon">
                    Apply
                  </button>
                )}
              </form>

              {appliedCoupon && (
                <div className="applied-coupon-pill">
                  <FiCheck />
                  <span>{appliedCoupon.label}</span>
                </div>
              )}

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="summary-line discount-line">
                    <span>Privilege Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="summary-line">
                  <span>Estimated GST (5%)</span>
                  <span>₹{taxes}</span>
                </div>

                <div className="summary-line">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="free-badge">FREE (Over ₹299)</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-line total-line">
                  <span>Grand Total</span>
                  <span className="grand-total-val">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="btn btn-primary btn-checkout"
                id="proceed-checkout-btn"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </button>

              <div className="cart-guarantee">
                <span>🛡️ 100% Thermal Boiling Guarantee & Safe Hygiene</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
