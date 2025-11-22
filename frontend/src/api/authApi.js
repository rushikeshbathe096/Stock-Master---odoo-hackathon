// Authentication API

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Token helpers (centralized to make testing easier)
const getToken = () => localStorage.getItem('token');
const setToken = (token) => { if (token) localStorage.setItem('token', token); };
const clearToken = () => localStorage.removeItem('token');

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  // Login: store returned token to localStorage for subsequent calls
  login: async (credentials) => {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res && res.token) setToken(res.token);
    return res;
  },

  // Signup/Register
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Get current user profile
  getProfile: () => apiCall('/auth/profile'),

  // Update user profile
  updateProfile: (data) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Change password
  changePassword: (data) => apiCall('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Logout: clear token locally and notify backend
  logout: async () => {
    clearToken();
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore network errors on logout; token already cleared
    }
    return { ok: true };
  },

  // Refresh token (if implemented)
  refreshToken: () => apiCall('/auth/refresh', {
    method: 'POST',
  }),

  // Expose token helpers for other parts of the app
  _helpers: { getToken, setToken, clearToken },
};