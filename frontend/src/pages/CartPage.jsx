import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';

export default function CartPage({ onNavigate, onSelectProduct }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotalAmount,
    shippingAmount,
    estimatedTax,
    grandTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-view">
        <div className="empty-cart-icon-box">
          <ShoppingBag size={48} />
        </div>
        <h2 className="empty-cart-heading">Your cart is currently empty</h2>
        <p className="empty-cart-subtext">
          Looks like you haven't added any products to your shopping bag yet.
        </p>
        <button onClick={() => onNavigate('products')} className="explore-catalog-btn">
          <ArrowLeft size={16} /> Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <div>
          <h1 className="cart-page-title">Shopping Cart</h1>
          <p className="cart-page-sub">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button onClick={clearCart} className="clear-cart-btn" title="Remove all items">
          <Trash2 size={15} /> Clear Cart
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-items-table-header">
            <span className="col-product">Product</span>
            <span className="col-price">Price</span>
            <span className="col-quantity">Quantity</span>
            <span className="col-total">Subtotal</span>
            <span className="col-action"></span>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                {/* Product Media & Title */}
                <div
                  className="cart-item-product"
                  onClick={() => onSelectProduct(item.id)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <span className="cart-item-sku">SKU: PROD-{item.id.toString().padStart(4, '0')}</span>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="cart-item-unit-price">
                  ${item.price.toFixed(2)}
                </div>

                {/* Quantity Stepper */}
                <div className="cart-item-qty-cell">
                  <div className="quantity-stepper">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="stepper-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="stepper-value">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stockQuantity && item.quantity >= item.stockQuantity}
                      className="stepper-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="cart-item-subtotal-cell">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Action */}
                <div className="cart-item-action-cell">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-item-btn"
                    title="Remove item from cart"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-back-row">
            <button onClick={() => onNavigate('products')} className="continue-shopping-link">
              <ArrowLeft size={16} /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="cart-summary-column">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Items Subtotal</span>
                <span className="summary-val">${subtotalAmount.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Estimated Shipping</span>
                <span className="summary-val">
                  {shippingAmount === 0 ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    `$${shippingAmount.toFixed(2)}`
                  )}
                </span>
              </div>

              {shippingAmount > 0 && (
                <p className="shipping-upsell-hint">
                  Add ${(150 - subtotalAmount).toFixed(2)} more to qualify for <strong>FREE shipping</strong>!
                </p>
              )}

              <div className="summary-row">
                <span className="summary-label">Estimated Tax (8%)</span>
                <span className="summary-val">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span className="total-label">Grand Total</span>
                <div className="total-value-group">
                  <span className="total-currency">USD</span>
                  <span className="total-amount">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="proceed-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="summary-security-note">
              <ShieldCheck size={16} />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
