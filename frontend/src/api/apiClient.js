/**
 * DevStore API Client
 * Centralized HTTP client communicating with ASP.NET Core Web API backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to execute fetch requests with error parsing and JSON handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse JSON response body if present
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.title || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend API server. Please ensure the ASP.NET Core API is running at http://localhost:5000.');
    }
    throw err;
  }
}

export const api = {
  // Products API
  products: {
    getAll: (search = '') => {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      return request(`/products${query}`, { method: 'GET' });
    },
    getById: (id) => request(`/products/${id}`, { method: 'GET' }),
    create: (productData) => request('/products', { method: 'POST', body: JSON.stringify(productData) }),
    update: (id, productData) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  },

  // Users API
  users: {
    register: (userData) => request('/users/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/users/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getById: (id) => request(`/users/${id}`, { method: 'GET' }),
  },

  // Orders API
  orders: {
    create: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getByUserId: (userId) => request(`/orders/user/${userId}`, { method: 'GET' }),
    getById: (id) => request(`/orders/${id}`, { method: 'GET' }),
  },

  // Health check
  health: () => request('/health', { method: 'GET' }),
};
