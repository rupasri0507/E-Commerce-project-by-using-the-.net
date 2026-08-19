import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'devstore_cart_items';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (product.stockQuantity && newQty > product.stockQuantity) {
          showToast(`Only ${product.stockQuantity} items in stock for ${product.name}`, 'warning');
          return prevItems;
        }
        showToast(`Updated "${product.name}" quantity to ${newQty}`, 'success');
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (product.stockQuantity && quantity > product.stockQuantity) {
          showToast(`Only ${product.stockQuantity} items in stock for ${product.name}`, 'warning');
          return prevItems;
        }
        showToast(`Added "${product.name}" to your cart`, 'success');
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stockQuantity: product.stockQuantity,
            quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          if (item.stockQuantity && quantity > item.stockQuantity) {
            showToast(`Maximum available stock is ${item.stockQuantity}`, 'warning');
            return { ...item, quantity: item.stockQuantity };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const removed = prevItems.find((item) => item.id === productId);
      if (removed) {
        showToast(`Removed "${removed.name}" from cart`, 'info');
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingAmount = subtotalAmount > 0 && subtotalAmount < 150 ? 9.99 : 0;
  const estimatedTax = subtotalAmount > 0 ? Number((subtotalAmount * 0.08).toFixed(2)) : 0;
  const grandTotal = subtotalAmount + shippingAmount + estimatedTax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotalAmount,
        shippingAmount,
        estimatedTax,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
