import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});


// 🔹 Request Interceptor: Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor: Handle 401 (Unauthorized)
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

// ✅ Auth Endpoints
export const auth = {
  login: (credentials) => api.post('/api/auth/login', credentials),

  // 🔹 Fix: Separate signup for user & captain
  signupUser: (userData) => api.post('/api/auth/user/signup', userData),
  signupCaptain: (captainData) => api.post('/api/auth/captain/signup', captainData),
  verifyOTP: (data) => api.post('/api/auth/verify-otp', data),
  resendOTP: (type) => api.post('/api/auth/resend-otp', { type }),

  getProfile: () => api.get('/api/auth/profile')
};

// ✅ User Endpoints
export const users = {
  updateProfile: (data) => api.put('/api/auth/profile', data),
  getRides: () => api.get('/api/users/rides')
};

// ✅ Captain Endpoints
export const captains = {
  updateProfile: (data) => api.put('/api/auth/profile', data),
  updateLocation: (coordinates) => api.post('/api/captains/location', { coordinates }),
  updateStatus: (status) => api.post('/api/captains/status', { status }),
  getRides: () => api.get('/api/captains/rides')
};

// ✅ Ride Endpoints
export const rides = {
  create: (data) => api.post('/api/rides', data),
  getHistory: () => api.get('/api/rides/history'),
  accept: (id) => api.post(`/api/rides/${id}/accept`),
  complete: (id) => api.post(`/api/rides/${id}/complete`)
};

// ✅ Payment Endpoints
export const payments = {
  createOrder: (amount) => api.post('/api/payments/create-order', { amount }),
  verify: (data) => api.post('/api/payments/verify', data)
};

// ✅ Rating Endpoints
export const ratings = {
  create: (data) => api.post('/api/ratings', data),
  getCaptainRatings: (id) => api.get(`/api/ratings/captain/${id}`)
};

// ✅ Admin Endpoints
export const admin = {
  getStats: () => api.get('/api/admin/stats'),
  getRideRequests: () => api.get('/api/admin/ride-requests'),
  getCaptains: () => api.get('/api/admin/captains'),
  getUserActivity: () => api.get('/api/admin/user-activity'),
  getCaptainActivity: () => api.get('/api/admin/captain-activity'),
  handleRideAction: (id, action) => api.post(`/api/admin/rides/${id}/${action}`)
};

export default api;
