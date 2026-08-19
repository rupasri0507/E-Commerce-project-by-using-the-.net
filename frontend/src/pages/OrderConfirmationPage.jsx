import React from 'react';
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Calendar, User, Hash, Check } from 'lucide-react';

export default function OrderConfirmationPage({ order, onNavigate }) {
  if (!order) {
    return (
      <div className="order-confirmation-empty">
        <p>No order details available.</p>
        <button onClick={() => onNavigate('products')} className="explore-catalog-btn">
          Go to Products
        </button>
      </div>
    );
  }

  const formattedDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-card">
        {/* Success Header */}
        <div className="confirmation-header">
          <div className="success-icon-badge">
            <CheckCircle2 size={44} className="success-icon" />
          </div>
          <span className="order-status-pill">{order.status || 'Completed'}</span>
          <h1 className="confirmation-title">Thank You For Your Order!</h1>
          <p className="confirmation-subtitle">
            Your order has been recorded in the database. A confirmation email has been dispatched to <strong>{order.customerEmail || 'your email'}</strong>.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="order-meta-bar">
          <div className="meta-item">
            <span className="meta-label"><Hash size={14} /> Order Number</span>
            <strong className="meta-value">#{order.id}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label"><Calendar size={14} /> Date Placed</span>
            <strong className="meta-value">{formattedDate}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label"><User size={14} /> Customer</span>
            <strong className="meta-value">{order.customerName || 'Customer'}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">Total Amount</span>
            <strong className="meta-value total-highlight">${order.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="confirmation-items-box">
          <h3 className="items-box-title">
            <Package size={18} /> Items Ordered ({order.items ? order.items.length : 0})
          </h3>

          <div className="confirmation-items-list">
            {order.items && order.items.map((item) => (
              <div key={item.id} className="confirm-item-row">
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="confirm-item-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="confirm-item-info">
                  <h4 className="confirm-item-name">{item.productName}</h4>
                  <span className="confirm-item-qty">Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}</span>
                </div>
                <div className="confirm-item-subtotal">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button onClick={() => onNavigate('products')} className="primary-action-btn">
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </button>

          <button onClick={() => onNavigate('orders')} className="secondary-action-btn">
            <span>View All My Orders</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
