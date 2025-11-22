// Operations API - Receipts, Deliveries, and Adjustments

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

// Receipt API
export const receiptApi = {
  // Get all receipts
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/receipts${queryString ? `?${queryString}` : ''}`);
  },

  // Get receipt by ID
  getById: (id) => apiCall(`/receipts/${id}`),

  // Create new receipt
  create: (data) => apiCall('/receipts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update receipt
  update: (id, data) => apiCall(`/receipts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete receipt
  delete: (id) => apiCall(`/receipts/${id}`, {
    method: 'DELETE',
  }),

  // Confirm receipt
  confirm: (id) => apiCall(`/receipts/${id}/confirm`, {
    method: 'POST',
  }),

  // Cancel receipt
  cancel: (id) => apiCall(`/receipts/${id}/cancel`, {
    method: 'POST',
  }),

  // Get receipt items
  getItems: (id) => apiCall(`/receipts/${id}/items`),
};

// Delivery API
export const deliveryApi = {
  // Get all deliveries
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/deliveries${queryString ? `?${queryString}` : ''}`);
  },

  // Get delivery by ID
  getById: (id) => apiCall(`/deliveries/${id}`),

  // Create new delivery
  create: (data) => apiCall('/deliveries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update delivery
  update: (id, data) => apiCall(`/deliveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete delivery
  delete: (id) => apiCall(`/deliveries/${id}`, {
    method: 'DELETE',
  }),

  // Confirm delivery
  confirm: (id) => apiCall(`/deliveries/${id}/confirm`, {
    method: 'POST',
  }),

  // Cancel delivery
  cancel: (id) => apiCall(`/deliveries/${id}/cancel`, {
    method: 'POST',
  }),

  // Get delivery items
  getItems: (id) => apiCall(`/deliveries/${id}/items`),
};

// Adjustment API
export const adjustmentApi = {
  // Get all adjustments
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/adjustments${queryString ? `?${queryString}` : ''}`);
  },

  // Get adjustment by ID
  getById: (id) => apiCall(`/adjustments/${id}`),

  // Create new adjustment
  create: (data) => apiCall('/adjustments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update adjustment
  update: (id, data) => apiCall(`/adjustments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete adjustment
  delete: (id) => apiCall(`/adjustments/${id}`, {
    method: 'DELETE',
  }),

  // Confirm adjustment
  confirm: (id) => apiCall(`/adjustments/${id}/confirm`, {
    method: 'POST',
  }),

  // Cancel adjustment
  cancel: (id) => apiCall(`/adjustments/${id}/cancel`, {
    method: 'POST',
  }),

  // Get adjustment items
  getItems: (id) => apiCall(`/adjustments/${id}/items`),
};

// Move History API
export const moveHistoryApi = {
  // Get all move history
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/move-history${queryString ? `?${queryString}` : ''}`);
  },

  // Get move history by ID
  getById: (id) => apiCall(`/move-history/${id}`),

  // Get move history by product
  getByProduct: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/move-history/product/${productId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get move history by location
  getByLocation: (locationId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/move-history/location/${locationId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get move history by warehouse
  getByWarehouse: (warehouseId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/move-history/warehouse/${warehouseId}${queryString ? `?${queryString}` : ''}`);
  },
};

// Export all APIs
export default {
  receipt: receiptApi,
  delivery: deliveryApi,
  adjustment: adjustmentApi,
  moveHistory: moveHistoryApi,
};