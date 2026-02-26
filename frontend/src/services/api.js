import axios from 'axios';

// In production, set VITE_API_BASE_URL (e.g. https://your-app.onrender.com) — no trailing slash
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const API = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/** Use for product image src: in production, prefix /uploads with backend URL */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_API_BASE_URL || '';
  return base ? `${base}${path.startsWith('/') ? path : '/' + path}` : path;
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getMy: () => API.get('/products/my'),
  create: (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity = 1) => API.post('/cart', { productId, quantity }),
  updateItem: (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => API.delete(`/cart/${itemId}`),
};

export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getMy: () => API.get('/orders/my'),
  getSeller: () => API.get('/orders/seller'),
  getOne: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

export const adminAPI = {
  getPendingSellers: () => API.get('/admin/sellers/pending'),
  approveSeller: (id) => API.put(`/admin/sellers/${id}/approve`),
  getUsers: (params) => API.get('/admin/users', { params }),
  getAnalytics: () => API.get('/admin/analytics'),
  getOrders: () => API.get('/admin/orders'),
};

export default API;
