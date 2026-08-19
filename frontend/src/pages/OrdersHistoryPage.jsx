import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Calendar, Clock, ShoppingBag, ArrowLeft, RefreshCw, UserCheck, AlertCircle } from 'lucide-react';

export default function OrdersHistoryPage({ onNavigate, onSelectProduct }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.orders.getByUserId(user.id);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="orders-unauth-state">
        <Package size={48} className="unauth-icon" />
        <h2>Sign In to View Orders</h2>
        <p>Please log in to your account to view your past purchases and order history.</p>
        <button onClick={() => openAuthModal('login')} className="primary-action-btn">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="orders-history-page">
      <div className="orders-header-bar">
        <div>
          <button onClick={() => onNavigate('products')} className="breadcrumb-back-btn">
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <h1 className="orders-title">Order History</h1>
          <p className="orders-subtitle">Showing orders placed by <strong>{user.fullName}</strong> ({user.email})</p>
        </div>

        <button onClick={fetchOrders} className="refresh-orders-btn" title="Refresh list">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your orders from database..." />
      ) : error ? (
        <div className="api-error-card">
          <p className="api-error-text">{error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-orders-card">
          <ShoppingBag size={42} />
          <h3>No orders placed yet</h3>
          <p>When you complete a checkout, your order records will appear here.</p>
          <button onClick={() => onNavigate('products')} className="primary-action-btn">
            Browse Store
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const dateStr = new Date(order.orderDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order.id} className="order-history-card">
                <div className="order-card-header">
                  <div className="order-card-info">
                    <span className="order-id-tag">Order #{order.id}</span>
                    <span className="order-date-tag">
                      <Calendar size={13} /> {dateStr}
                    </span>
                  </div>
                  <div className="order-card-status">
                    <span className="order-status-badge">{order.status || 'Completed'}</span>
                    <strong className="order-card-total">${order.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="order-items-compact-list">
                  {order.items && order.items.map((item) => (
                    <div
                      key={item.id}
                      className="order-item-compact-row"
                      onClick={() => onSelectProduct && onSelectProduct(item.productId)}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="order-item-thumb"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="order-item-compact-info">
                        <span className="order-item-compact-name">{item.productName}</span>
                        <span className="order-item-compact-meta">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="order-item-compact-subtotal">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
