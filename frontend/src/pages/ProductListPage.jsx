import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, ShieldCheck, Zap, Truck, ArrowUpDown, RefreshCw } from 'lucide-react';

export default function ProductListPage({ onSelectProduct, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'name'

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.products.getAll(searchQuery);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products from the backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // featured / default order
  });

  return (
    <div className="product-list-page">
      {/* Hero Banner */}
      {!searchQuery && (
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} /> Full-Stack ASP.NET Core & React Store
            </div>
            <h1 className="hero-title">
              Engineered Gear for <span className="gradient-text">Developers & Creators</span>
            </h1>
            <p className="hero-subtitle">
              Explore our curated selection of premium audio, desk setups, mechanical keyboards, and daily essentials. Built with C# Web API and Entity Framework Core.
            </p>
            <div className="hero-perks-row">
              <div className="perk-item">
                <Truck size={18} className="perk-icon" />
                <span>Free shipping on orders over $150</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={18} className="perk-icon" />
                <span>2-Year Warranty Included</span>
              </div>
              <div className="perk-item">
                <Zap size={18} className="perk-icon" />
                <span>Instant Stock Synchronization</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalog Header & Controls */}
      <div className="catalog-header-bar">
        <div className="catalog-title-group">
          <h2 className="catalog-heading">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h2>
          <span className="catalog-count-pill">{products.length} Items</span>
        </div>

        <div className="catalog-sort-group">
          <label htmlFor="sort-select" className="sort-label">
            <ArrowUpDown size={15} /> Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Featured / Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner message="Fetching products from ASP.NET Core API..." />
      ) : error ? (
        <div className="api-error-card">
          <p className="api-error-text">{error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            <RefreshCw size={16} /> Retry Connection
          </button>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="empty-catalog-card">
          <h3>No products found</h3>
          <p>Try searching for a different term or clearing your search filter.</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
