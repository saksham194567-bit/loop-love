/**
 * Loop & Love — Centralized API Client Service
 * Connects frontend components to the PostgreSQL Node.js backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach customer or admin token if present
  const customerToken = localStorage.getItem('loop_and_love_token');
  const adminToken = localStorage.getItem('loop_and_love_admin_token');

  if (options.isAdmin && adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  } else if (customerToken) {
    headers['Authorization'] = `Bearer ${customerToken}`;
  }

  // Session ID for guest cart
  let sessionId = localStorage.getItem('loop_and_love_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('loop_and_love_session_id', sessionId);
  }
  headers['x-session-id'] = sessionId;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    getAddresses: () => request('/auth/addresses'),
    addAddress: (addressData) => request('/auth/addresses', { method: 'POST', body: JSON.stringify(addressData) }),
    deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug) => request(`/products/${slug}`),
  },

  // Categories
  categories: {
    getAll: () => request('/categories'),
    getBySlug: (slug) => request(`/categories/${slug}`),
  },

  // Shopping Cart
  cart: {
    get: () => request('/cart'),
    add: (productId, quantity = 1, variantSelection = null) =>
      request('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, variantSelection }),
      }),
    updateItem: (itemId, quantity) =>
      request(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (itemId) => request(`/cart/items/${itemId}`, { method: 'DELETE' }),
    clear: () => request('/cart/clear', { method: 'DELETE' }),
  },

  // Checkout & Payments
  checkout: {
    createOrder: (orderData) =>
      request('/checkout/create-order', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    verifyPayment: (paymentData) =>
      request('/checkout/verify-payment', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }),
  },

  // Orders & Tracking
  orders: {
    track: (orderNumber) => request(`/orders/track/${encodeURIComponent(orderNumber)}`),
    getMyOrders: () => request('/orders/my-orders'),
  },

  // Contact & Inquiries
  contact: {
    submit: (formData) =>
      request('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      }),
  },

  // Newsletter
  newsletter: {
    subscribe: (email) =>
      request('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },

  // Store Settings
  settings: {
    get: () => request('/settings'),
  },

  // Admin Portal Operations
  admin: {
    login: (credentials) =>
      request('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    getStats: () => request('/admin/stats', { isAdmin: true }),
    getOrders: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/orders${query ? `?${query}` : ''}`, { isAdmin: true });
    },
    updateOrderStatus: (id, statusData) =>
      request(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
        isAdmin: true,
      }),
    getCustomers: () => request('/admin/customers', { isAdmin: true }),
    getInventory: () => request('/admin/inventory', { isAdmin: true }),
    updateInventory: (id, data) =>
      request(`/admin/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        isAdmin: true,
      }),
    getContactMessages: () => request('/admin/contact-messages', { isAdmin: true }),
    markContactMessageRead: (id) =>
      request(`/admin/contact-messages/${id}/read`, {
        method: 'PUT',
        isAdmin: true,
      }),
    getNewsletterSubscribers: () => request('/admin/newsletter-subscribers', { isAdmin: true }),
    createProduct: (productData) =>
      request('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        isAdmin: true,
      }),
    updateProduct: (id, productData) =>
      request(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
        isAdmin: true,
      }),
    deleteProduct: (id) =>
      request(`/admin/products/${id}`, {
        method: 'DELETE',
        isAdmin: true,
      }),
    updateSettings: (settingsData) =>
      request('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData),
        isAdmin: true,
      }),
  },
};

export default api;

