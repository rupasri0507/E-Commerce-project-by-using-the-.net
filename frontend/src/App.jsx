import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import AuthModal from './pages/AuthModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('products'); // 'products' | 'detail' | 'cart' | 'checkout' | 'confirmation' | 'orders'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProducts = () => {
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderData) => {
    setLastConfirmedOrder(orderData);
    setCurrentPage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (currentPage !== 'products') {
      setCurrentPage('products');
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-layout">
          {/* Top Sticky Navbar */}
          <Navbar
            onNavigate={handleNavigate}
            currentPage={currentPage}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />

          {/* Main Content View Switcher */}
          <main className="app-main-content">
            {currentPage === 'products' && (
              <ProductListPage
                onSelectProduct={handleSelectProduct}
                searchQuery={searchQuery}
              />
            )}

            {currentPage === 'detail' && (
              <ProductDetailPage
                productId={selectedProductId}
                onBack={handleBackToProducts}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                onNavigate={handleNavigate}
                onOrderSuccess={handleOrderSuccess}
              />
            )}

            {currentPage === 'confirmation' && (
              <OrderConfirmationPage
                order={lastConfirmedOrder}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'orders' && (
              <OrdersHistoryPage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notification Container */}
          <ToastContainer />

          {/* User Auth Modal */}
          <AuthModal />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
