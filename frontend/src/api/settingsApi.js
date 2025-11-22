// Settings API - Warehouse and Location management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
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

// Warehouse API
export const warehouseApi = {
  // Get all warehouses
  getAll: () => apiCall('/warehouses'),

  // Get warehouse by ID
  getById: (id) => apiCall(`/warehouses/${id}`),

  // Create new warehouse
  create: (data) => apiCall('/warehouses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update warehouse
  update: (id, data) => apiCall(`/warehouses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete warehouse
  delete: (id) => apiCall(`/warehouses/${id}`, {
    method: 'DELETE',
  }),
};

// Location API
export const locationApi = {
  // Get all locations
  getAll: () => apiCall('/locations'),

  // Get locations by warehouse ID
  getByWarehouse: (warehouseId) => apiCall(`/warehouses/${warehouseId}/locations`),

  // Get location by ID
  getById: (id) => apiCall(`/locations/${id}`),

  // Create new location
  create: (data) => apiCall('/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update location
  update: (id, data) => apiCall(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete location
  delete: (id) => apiCall(`/locations/${id}`, {
    method: 'DELETE',
  }),
};