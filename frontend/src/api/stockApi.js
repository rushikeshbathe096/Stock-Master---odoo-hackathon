// Stock API - Stock management and queries

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

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

// Stock API
export const stockApi = {
  // Get all stock (quants) with filters
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/inventory/quants${queryString ? `?${queryString}` : ''}`);
  },

  // Get stock by product ID
  getByProduct: (productId, params = {}) => {
    const query = { productId, ...params };
    const queryString = new URLSearchParams(query).toString();
    return apiCall(`/inventory/quants?${queryString}`);
  },

  // Get stock by location ID
  getByLocation: (locationId, params = {}) => {
    const query = { locationId, ...params };
    const queryString = new URLSearchParams(query).toString();
    return apiCall(`/inventory/quants?${queryString}`);
  },

  // Get stock by warehouse ID
  getByWarehouse: (warehouseId, params = {}) => {
    const query = { warehouseId, ...params };
    const queryString = new URLSearchParams(query).toString();
    return apiCall(`/inventory/quants?${queryString}`);
  },

  // Get stock for specific product and location
  getByProductAndLocation: (productId, locationId) => {
    return apiCall(`/inventory/quants?productId=${productId}&locationId=${locationId}`);
  },

  // Update stock quantity via an adjustment (creates an adjustment document)
  // `data` should be { warehouseId, lines: [{ productId, quantity, note }] }
  updateQuantity: (productId, locationId, data) => {
    // prefer createAdjustment endpoint to change quantities safely
    return apiCall('/inventory/adjustments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Bulk update stock quantities (map to multiple adjustments)
  bulkUpdate: (data) => {
    // Backend currently exposes single adjustment creation; clients may post an array and
    // backend can be extended to accept bulk. For now post to same endpoint.
    return apiCall('/inventory/adjustments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get low stock items (use reorder-rules/alerts)
  getLowStock: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/inventory/alerts/low-stock${queryString ? `?${queryString}` : ''}`);
  },

  // Get stock summary (dashboard)
  getSummary: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/inventory/dashboard${queryString ? `?${queryString}` : ''}`);
  },

  // Get stock movements
  getMovements: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/inventory/moves${queryString ? `?${queryString}` : ''}`);
  },
};

// Product API (for stock management)
export const productApi = {
  // Get all products
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get product by ID
  getById: (id) => apiCall(`/products/${id}`),

  // Create new product
  create: (data) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update product
  update: (id, data) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete product
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),

  // Search products
  search: (query, params = {}) => {
    const queryParams = new URLSearchParams({
      q: query,
      ...params,
    });
    return apiCall(`/products/search?${queryParams.toString()}`);
  },
};

// Export all APIs
export default {
  stock: stockApi,
  product: productApi,
};