import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
  verifyOTP: (data) => api.post('/api/auth/verify-otp', data),
  resendOTP: (type) => api.post('/api/auth/resend-otp', { type })
};

// User endpoints
export const users = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getRides: () => api.get('/api/users/rides')
};

// Captain endpoints
export const captains = {
  getProfile: () => api.get('/api/captains/profile'),
  updateProfile: (data) => api.put('/api/captains/profile', data),
  updateLocation: (coordinates) => api.post('/api/captains/location', { coordinates }),
  updateStatus: (status) => api.post('/api/captains/status', { status }),
  getRides: () => api.get('/api/captains/rides')
};

// Ride endpoints
export const rides = {
  create: (data) => api.post('/api/rides', data),
  getHistory: () => api.get('/api/rides/history'),
  accept: (id) => api.post(`/api/rides/${id}/accept`),
  complete: (id) => api.post(`/api/rides/${id}/complete`)
};

// Payment endpoints
export const payments = {
  createOrder: (amount) => api.post('/api/payments/create-order', { amount }),
  verify: (data) => api.post('/api/payments/verify', data)
};

// Rating endpoints
export const ratings = {
  create: (data) => api.post('/api/ratings', data),
  getCaptainRatings: (id) => api.get(`/api/ratings/captain/${id}`)
};

// Admin endpoints
export const admin = {
  getStats: () => api.get('/api/admin/stats'),
  getRideRequests: () => api.get('/api/admin/ride-requests'),
  getCaptains: () => api.get('/api/admin/captains'),
  getUserActivity: () => api.get('/api/admin/user-activity'),
  getCaptainActivity: () => api.get('/api/admin/captain-activity'),
  handleRideAction: (id, action) => api.post(`/api/admin/rides/${id}/${action}`)
};

export default api;