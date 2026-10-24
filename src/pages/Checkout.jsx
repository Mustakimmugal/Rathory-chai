import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiCheckCircle,
  FiTruck,
  FiShoppingBag,
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiLock,
  FiArrowRight,
} from 'react-icons/fi';
import './Checkout.css';

export default function Checkout() {
  const { state, dispatch, addToast } = useApp();
  const navigate = useNavigate();

  // Load saved metadata from cart
  const [orderMeta, setOrderMeta] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rathory_order_meta');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const cart = state.cart;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const [deliveryType, setDeliveryType] = useState('delivery'); // delivery or pickup
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, COD

  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    phone: state.user?.phone || '',
    email: state.user?.email || '',
    address: state.user?.address || '',
    landmark: '',
    city: 'Jaipur',
    pincode: '302001',
    instructions: orderMeta?.specialInstructions || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = state.cartTotal;
  const discountAmount = orderMeta?.appliedCoupon?.discount || 0;
  const deliveryFee = deliveryType === 'pickup' ? 0 : orderMeta?.deliveryFee || (subtotal >= 299 ? 0 : 35);
  const taxes = orderMeta?.taxes || Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + taxes);

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || (deliveryType === 'delivery' && !formData.address)) {
      addToast('Please fill all required delivery details', 'error');
      return;
    }

    setIsSubmitting(true);

    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      id: newOrderId,
      customerId: state.user?.id || 999,
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: deliveryType === 'pickup' ? 'Cafe Dine-In Pickup (Jaipur Flagship)' : `${formData.address}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city} - ${formData.pincode}`,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.qty,
        price: item.discount ? Math.round(item.price - (item.price * item.discount) / 100) : item.price,
      })),
      total: grandTotal,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      paymentMethod: paymentMethod,
      orderStatus: 'confirmed',
      deliveryType: deliveryType,
      specialInstructions: formData.instructions,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      dispatch({ type: 'PLACE_ORDER', payload: orderPayload });
      sessionStorage.removeItem('rathory_order_meta');
      addToast(`Order ${newOrderId} successfully placed! ☕`, 'success');
      navigate(`/track-order?id=${newOrderId}`);
    }, 1200);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div className="container">
          <span className="section-subtitle">Almost There</span>
          <h1 className="section-title">Royal Order Checkout</h1>
          <div className="gold-line"></div>
        </div>
      </div>

      <div className="container section">
        <form onSubmit={handlePlaceOrder} className="checkout-layout-grid">
          {/* LEFT: DELIVERY & PAYMENT DETAILS */}
          <div className="checkout-form-column">
            {/* DELIVERY OPTION TABS */}
            <div className="delivery-type-selector">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`type-tab-btn ${deliveryType === 'delivery' ? 'active' : ''}`}
              >
                <FiTruck />
                <div>
                  <strong>Boiling Hot Delivery</strong>
                  <span>Direct to your doorstep (30-40 mins)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`type-tab-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
              >
                <FiShoppingBag />
                <div>
                  <strong>Cafe Takeaway / Pickup</strong>
                  <span>Ready at counter in 15 mins (Free)</span>
                </div>
              </button>
            </div>

            {/* CUSTOMER & ADDRESS DETAILS */}
            <div className="checkout-section-card">
              <h3 className="card-heading">
                {deliveryType === 'delivery' ? '1. Delivery Details' : '1. Contact Details'}
              </h3>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashvardhan Singh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number (For Delivery Updates) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="yash@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {deliveryType === 'delivery' && (
                <>
                  <div className="form-group">
                    <label>Street Address / Flat / Society *</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="House/Apartment #, Colony/Street name"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Landmark</label>
                      <input
                        type="text"
                        placeholder="Near City Palace"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>PIN Code</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="checkout-section-card">
              <h3 className="card-heading">2. Payment Method</h3>

              <div className="payment-options-grid">
                <div
                  className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <div className="payment-radio">
                    <span className="dot"></span>
                  </div>
                  <FiSmartphone className="pay-icon" />
                  <div>
                    <strong>Instant UPI</strong>
                    <p>Google Pay, PhonePe, Paytm, QR</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  <div className="payment-radio">
                    <span className="dot"></span>
                  </div>
                  <FiCreditCard className="pay-icon" />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <p>Visa, MasterCard, RuPay</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="payment-radio">
                    <span className="dot"></span>
                  </div>
                  <FiDollarSign className="pay-icon" />
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <p>Pay upon delivery arrival</p>
                  </div>
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="payment-helper-box">
                  <p>⚡ Instant verification with UPI intent. No extra convenience charge.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Order Review</h3>

              <div className="checkout-items-mini-list">
                {cart.map((item) => (
                  <div key={item.id} className="mini-item-row">
                    <div className="mini-item-name">
                      <span>{item.qty}x</span>
                      <strong>{item.name}</strong>
                    </div>
                    <span className="mini-item-price">
                      ₹{(item.discount ? Math.round(item.price - (item.price * item.discount) / 100) : item.price) * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-line discount-line">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>GST (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="summary-line">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-line total-line">
                  <span>Total Payable</span>
                  <span className="grand-total-val">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-place-order"
                id="place-order-submit-btn"
              >
                {isSubmitting ? (
                  <span>Brewing & Confirming...</span>
                ) : (
                  <>
                    <FiLock />
                    <span>Confirm & Place Order (₹{grandTotal})</span>
                  </>
                )}
              </button>

              <p className="security-notice">
                🔒 Safe 256-bit encrypted checkout. All spices freshly pounded for your order.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
