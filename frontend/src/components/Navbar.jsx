import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Package, Search, Sparkles, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentPage, onSearch, searchQuery }) {
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('products')} role="button" tabIndex={0}>
          <div className="brand-icon-wrapper">
            <ShoppingBag className="brand-icon" size={22} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">DevStore</span>
            <span className="brand-badge">.NET 8 & React</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search headphones, keyboards, smartwatches..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => onSearch('')} title="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links & Actions */}
        <nav className="navbar-actions">
          <button
            className={`nav-link-btn ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => handleNavClick('products')}
          >
            Catalog
          </button>

          {isAuthenticated && (
            <button
              className={`nav-link-btn ${currentPage === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavClick('orders')}
            >
              <Package size={16} />
              <span>My Orders</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            className={`cart-trigger-btn ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={() => handleNavClick('cart')}
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={20} />
            <span className="cart-btn-label">Cart</span>
            {totalItemsCount > 0 && (
              <span className="cart-badge-count">{totalItemsCount}</span>
            )}
          </button>

          {/* Auth Button / User Dropdown */}
          {isAuthenticated ? (
            <div className="user-profile-widget">
              <div className="user-avatar-badge" title={user.email}>
                <User size={16} />
                <span className="user-name-text">{user.fullName.split(' ')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="logout-action-btn"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="auth-cta-btn"
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="mobile-links-list">
            <button
              className={`mobile-link ${currentPage === 'products' ? 'active' : ''}`}
              onClick={() => handleNavClick('products')}
            >
              Catalog
            </button>

            <button
              className={`mobile-link ${currentPage === 'cart' ? 'active' : ''}`}
              onClick={() => handleNavClick('cart')}
            >
              Shopping Cart ({totalItemsCount})
            </button>

            {isAuthenticated ? (
              <>
                <button
                  className={`mobile-link ${currentPage === 'orders' ? 'active' : ''}`}
                  onClick={() => handleNavClick('orders')}
                >
                  My Orders
                </button>
                <div className="mobile-user-row">
                  <span>Signed in as <strong>{user.fullName}</strong></span>
                  <button onClick={logout} className="mobile-logout-btn">Log Out</button>
                </div>
              </>
            ) : (
              <button
                className="mobile-auth-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
