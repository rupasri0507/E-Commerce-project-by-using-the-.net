import React from 'react';
import { ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => onSelectProduct(product.id)}
      role="button"
      tabIndex={0}
    >
      {/* Product Image Container */}
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Stock Badge */}
        <div className="product-badge-wrapper">
          {isOutOfStock ? (
            <span className="stock-badge badge-out">Out of Stock</span>
          ) : isLowStock ? (
            <span className="stock-badge badge-low">Only {product.stockQuantity} left</span>
          ) : (
            <span className="stock-badge badge-in">In Stock</span>
          )}
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="quick-view-overlay">
          <span className="quick-view-btn">
            <Eye size={16} /> Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>
        <p className="product-desc">
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div className="product-price-action-row">
          <div className="product-price-block">
            <span className="price-currency">$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`add-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
            title={isOutOfStock ? 'Item is out of stock' : 'Add to cart'}
          >
            <ShoppingBag size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
