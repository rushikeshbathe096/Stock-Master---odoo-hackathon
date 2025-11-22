// Utility functions for formatting data

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'datetime', 'time'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '-';
  
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '-';
  
    const options = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      datetime: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' },
      time: { hour: '2-digit', minute: '2-digit' },
    };
  
    return dateObj.toLocaleDateString('en-US', options[format] || options.short);
  };
  
  /**
   * Format date to relative time (e.g., "2 hours ago", "3 days ago")
   * @param {string|Date} date - Date to format
   * @returns {string} Relative time string
   */
  export const formatRelativeTime = (date) => {
    if (!date) return '-';
  
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '-';
  
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  /**
   * Format number with thousand separators
   * @param {number|string} number - Number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number string
   */
  export const formatNumber = (number, decimals = 0) => {
    if (number === null || number === undefined || number === '') return '-';
    
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    if (isNaN(num)) return '-';
  
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };
  
  /**
   * Format currency amount
   * @param {number|string} amount - Amount to format
   * @param {string} currency - Currency code (default: 'USD')
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted currency string
   */
  export const formatCurrency = (amount, currency = 'USD', decimals = 2) => {
    if (amount === null || amount === undefined || amount === '') return '-';
    
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) return '-';
  
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };
  
  /**
   * Format percentage
   * @param {number|string} value - Value to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage string
   */
  export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined || value === '') return '-';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return '-';
  
    return `${num.toFixed(decimals)}%`;
  };
  
  /**
   * Format file size
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted file size string
   */
  export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  /**
   * Format phone number
   * @param {string} phone - Phone number to format
   * @returns {string} Formatted phone number
   */
  export const formatPhone = (phone) => {
    if (!phone) return '-';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };
  
  /**
   * Format address string
   * @param {object} address - Address object
   * @returns {string} Formatted address string
   */
  export const formatAddress = (address) => {
    if (!address) return '-';
    
    const parts = [];
    
    if (address.address) parts.push(address.address);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postal_code) parts.push(address.postal_code);
    if (address.country) parts.push(address.country);
    
    return parts.length > 0 ? parts.join(', ') : '-';
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Capitalize first letter of each word
   * @param {string} text - Text to capitalize
   * @returns {string} Capitalized text
   */
  export const capitalizeWords = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Format status badge text
   * @param {string} status - Status value
   * @returns {string} Formatted status text
   */
  export const formatStatus = (status) => {
    if (!status) return '-';
    
    const statusMap = {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      draft: 'Draft',
      confirmed: 'Confirmed',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      received: 'Received',
    };
    
    return statusMap[status.toLowerCase()] || capitalizeWords(status);
  };
  
  /**
   * Format location type
   * @param {string} type - Location type
   * @returns {string} Formatted location type
   */
  export const formatLocationType = (type) => {
    if (!type) return '-';
    
    const typeMap = {
      internal: 'Internal',
      vendor: 'Vendor',
      customer: 'Customer',
      inventory: 'Inventory',
      production: 'Production',
      transit: 'Transit',
    };
    
    return typeMap[type.toLowerCase()] || capitalizeWords(type);
  };
  
  /**
   * Format stock quantity with unit
   * @param {number} quantity - Quantity value
   * @param {string} unit - Unit of measurement
   * @returns {string} Formatted quantity string
   */
  export const formatQuantity = (quantity, unit = '') => {
    if (quantity === null || quantity === undefined || quantity === '') return '-';
    
    const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    
    if (isNaN(num)) return '-';
  
    const formatted = formatNumber(num, 2);
    return unit ? `${formatted} ${unit}` : formatted;
  };
  
  /**
   * Get color class for status
   * @param {string} status - Status value
   * @returns {string} CSS class name
   */
  export const getStatusColor = (status) => {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    
    if (['active', 'completed', 'confirmed', 'delivered', 'received'].includes(statusLower)) {
      return 'success';
    }
    if (['pending', 'in_transit'].includes(statusLower)) {
      return 'warning';
    }
    if (['inactive', 'cancelled'].includes(statusLower)) {
      return 'danger';
    }
    if (['draft'].includes(statusLower)) {
      return 'secondary';
    }
    
    return '';
  };
  
  /**
   * Format duration in human readable format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  export const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 && parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
  };
  
  /**
   * Format order/receipt number
   * @param {string|number} number - Order/receipt number
   * @param {string} prefix - Prefix (e.g., 'REC', 'DEL', 'ADJ')
   * @returns {string} Formatted number
   */
  export const formatDocumentNumber = (number, prefix = '') => {
    if (!number) return '-';
    
    const numStr = String(number).padStart(6, '0');
    return prefix ? `${prefix}-${numStr}` : numStr;
  };
  
  /**
   * Validate and format email
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Format time ago (alternative to formatRelativeTime)
   * @param {string|Date} date - Date to format
   * @returns {string} Time ago string
   */
  export const timeAgo = (date) => {
    return formatRelativeTime(date);
  };
  
  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Format array to comma-separated string
   * @param {Array} array - Array to format
   * @param {string} separator - Separator (default: ', ')
   * @returns {string} Formatted string
   */
  export const formatArray = (array, separator = ', ') => {
    if (!array || !Array.isArray(array) || array.length === 0) return '-';
    return array.join(separator);
  };
  
  /**
   * Format boolean to Yes/No
   * @param {boolean} value - Boolean value
   * @returns {string} 'Yes' or 'No'
   */
  export const formatBoolean = (value) => {
    if (value === null || value === undefined) return '-';
    return value ? 'Yes' : 'No';
  };