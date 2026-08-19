import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, AlertCircle } from 'lucide-react';

export default function ProductDetailPage({ productId, onBack, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.products.getById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Could not load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return <LoadingSpinner message="Loading product specifications..." />;
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <p className="api-error-text">{error || 'Product not found.'}</p>
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb / Back Link */}
      <button onClick={onBack} className="breadcrumb-back-btn">
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="product-detail-layout">
        {/* Left Column: Image Gallery */}
        <div className="product-detail-media">
          <div className="detail-image-wrapper">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="detail-main-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>

        {/* Right Column: Product Overview & Actions */}
        <div className="product-detail-info">
          {/* Stock Status Badge */}
          <div className="detail-badge-row">
            {isOutOfStock ? (
              <span className="stock-badge badge-out">Out of Stock</span>
            ) : isLowStock ? (
              <span className="stock-badge badge-low">Low Stock (Only {product.stockQuantity} remaining)</span>
            ) : (
              <span className="stock-badge badge-in">In Stock ({product.stockQuantity} available)</span>
            )}
            <span className="product-sku">SKU: PROD-{product.id.toString().padStart(4, '0')}</span>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>

          <div className="detail-price-row">
            <span className="detail-price-currency">$</span>
            <span className="detail-price-amount">{product.price.toFixed(2)}</span>
            <span className="detail-tax-hint">USD (Taxes calculated at checkout)</span>
          </div>

          <div className="detail-divider" />

          <p className="detail-description">{product.description}</p>

          {/* Quantity and Add to Cart Section */}
          <div className="detail-actions-panel">
            <div className="quantity-control-group">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="stepper-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-value">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stockQuantity || isOutOfStock}
                  className="stepper-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="cta-button-group">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`detail-add-btn ${isOutOfStock ? 'disabled' : ''}`}
              >
                <ShoppingBag size={18} />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => {
                  if (!isOutOfStock) {
                    addToCart(product, quantity);
                    onNavigate('cart');
                  }
                }}
                disabled={isOutOfStock}
                className="detail-buy-now-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          {/* Value Props & Trust Badges */}
          <div className="detail-trust-grid">
            <div className="trust-item">
              <Truck size={18} className="trust-icon" />
              <div>
                <strong>Express Delivery</strong>
                <p>Ships within 24-48 business hours</p>
              </div>
            </div>
            <div className="trust-item">
              <ShieldCheck size={18} className="trust-icon" />
              <div>
                <strong>Authentic Quality</strong>
                <p>100% genuine product guarantee</p>
              </div>
            </div>
            <div className="trust-item">
              <RotateCcw size={18} className="trust-icon" />
              <div>
                <strong>30-Day Hassle-Free Returns</strong>
                <p>Easy exchanges and full refunds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
