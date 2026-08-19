import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, ShieldCheck, CreditCard, Lock, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export default function CheckoutPage({ onNavigate, onOrderSuccess }) {
  const { cartItems, totalItemsCount, subtotalAmount, shippingAmount, estimatedTax, grandTotal, clearCart, showToast } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(user ? user.fullName : 'Jane Doe');
  const [email, setEmail] = useState(user ? user.email : 'jane.doe@example.com');
  const [address, setAddress] = useState('123 Innovation Way, Suite 400');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94105');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty-state">
        <h2>Your cart is empty</h2>
        <p>Please add items to your cart before proceeding to checkout.</p>
        <button onClick={() => onNavigate('products')} className="explore-catalog-btn">
          <ArrowLeft size={16} /> Return to Store
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let orderUserId = user?.id;

      // If not logged in, auto-register or authenticate customer seamlessly
      if (!orderUserId) {
        try {
          const regRes = await api.users.register({
            fullName: fullName.trim() || 'Guest Customer',
            email: email.trim().toLowerCase(),
            password: 'password123',
          });
          orderUserId = regRes.id;
        } catch (regErr) {
          // If email exists, try login or lookup user 1 (demo user)
          try {
            const loginRes = await api.users.login({
              email: email.trim().toLowerCase(),
              password: 'password123',
            });
            orderUserId = loginRes.id;
          } catch {
            // Default to demo user ID 1 if available
            orderUserId = 1;
          }
        }
      }

      // Build CreateOrderDto payload
      const orderPayload = {
        userId: orderUserId,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      // Call Orders API endpoint
      const createdOrder = await api.orders.create(orderPayload);

      // Clear cart
      clearCart();
      showToast(`Order #${createdOrder.id} placed successfully!`, 'success');

      // Navigate to order confirmation
      onOrderSuccess(createdOrder);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check stock or server connectivity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <button onClick={() => onNavigate('cart')} className="breadcrumb-back-btn">
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 className="checkout-page-title">Secure Checkout</h1>

      {error && (
        <div className="checkout-error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="checkout-grid-layout">
        {/* Left Column: Checkout Forms */}
        <div className="checkout-forms-column">
          {/* Auth State Banner */}
          <div className="checkout-auth-banner">
            {isAuthenticated ? (
              <div className="auth-status-logged">
                <UserCheck size={18} className="auth-check-icon" />
                <span>Checking out as <strong>{user.fullName}</strong> ({user.email})</span>
              </div>
            ) : (
              <div className="auth-status-guest">
                <span>Have an account?</span>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="auth-inline-link"
                >
                  Sign in for faster checkout
                </button>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="checkout-section-card">
            <h2 className="checkout-section-title">1. Customer Information</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="jane.doe@example.com"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="checkout-section-card">
            <h2 className="checkout-section-title">2. Shipping Address</h2>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ZIP / Postal Code</label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section-card">
            <h2 className="checkout-section-title">3. Payment Information</h2>
            <div className="payment-options-row">
              <label className={`payment-pill ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <CreditCard size={18} />
                <span>Credit / Debit Card</span>
              </label>

              <label className={`payment-pill ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-input-panel">
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CVC / Security Code</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Place Order CTA */}
        <div className="checkout-summary-column">
          <div className="summary-card">
            <h2 className="summary-title">Review Order ({totalItemsCount} items)</h2>

            <div className="checkout-items-preview">
              {cartItems.map((item) => (
                <div key={item.id} className="preview-item-row">
                  <img src={item.imageUrl} alt={item.name} className="preview-item-img" />
                  <div className="preview-item-info">
                    <span className="preview-item-name">{item.name}</span>
                    <span className="preview-item-qty">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="preview-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-val">${subtotalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-val">{shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Estimated Tax (8%)</span>
                <span className="summary-val">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span className="total-label">Total to Pay</span>
                <span className="total-amount">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="place-order-submit-btn"
            >
              {submitting ? (
                <>
                  <LoadingSpinner message="Processing Order..." />
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Place Order (${grandTotal.toFixed(2)})</span>
                </>
              )}
            </button>

            <div className="summary-security-note">
              <ShieldCheck size={16} />
              <span>Calls ASP.NET Core Orders API & Updates SQL Server inventory</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
