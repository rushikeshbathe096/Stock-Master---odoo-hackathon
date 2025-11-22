import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

/**
 * AdjustmentForm Component - For stock adjustments
 * @param {object} initialData - Initial form data (for editing)
 * @param {function} onSubmit - Submit handler
 * @param {function} onCancel - Cancel handler
 * @param {boolean} loading - Loading state
 * @param {Array} products - Available products list
 * @param {Array} warehouses - Available warehouses list
 * @param {Array} locations - Available locations list
 */
const AdjustmentForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  products = [],
  warehouses = [],
  locations = [],
}) => {
  const [formData, setFormData] = useState({
    adjustment_number: '',
    date: new Date().toISOString().split('T')[0],
    warehouse_id: '',
    location_id: '',
    reason: '',
    notes: '',
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    product_id: '',
    current_quantity: '',
    adjusted_quantity: '',
    difference: 0,
    unit: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        adjustment_number: initialData.adjustment_number || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        warehouse_id: initialData.warehouse_id || '',
        location_id: initialData.location_id || '',
        reason: initialData.reason || '',
        notes: initialData.notes || '',
        items: initialData.items || [],
      });
    }
  }, [initialData]);

  // Filter locations based on selected warehouse
  const filteredLocations = formData.warehouse_id
    ? locations.filter((loc) => loc.warehouse_id === formData.warehouse_id)
    : locations;

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle item field changes
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    
    setCurrentItem((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Calculate difference if both quantities are set
      if (name === 'adjusted_quantity' || name === 'current_quantity') {
        const currentQty = parseFloat(name === 'current_quantity' ? value : prev.current_quantity) || 0;
        const adjustedQty = parseFloat(name === 'adjusted_quantity' ? value : prev.adjusted_quantity) || 0;
        updated.difference = adjustedQty - currentQty;
      }

      return updated;
    });
  };

  // Fetch current stock quantity for a product
  const fetchCurrentStock = async (productId, locationId) => {
    // This would typically call an API to get current stock
    // For now, returning a placeholder
    return 0;
  };

  // Handle product selection
  const handleProductSelect = async (productId) => {
    if (!productId || !formData.location_id) return;

    setCurrentItem((prev) => ({
      ...prev,
      product_id: productId,
    }));

    // Fetch current stock
    const currentStock = await fetchCurrentStock(productId, formData.location_id);
    setCurrentItem((prev) => ({
      ...prev,
      current_quantity: currentStock.toString(),
    }));
  };

  // Add item to adjustment
  const handleAddItem = () => {
    if (!currentItem.product_id || currentItem.adjusted_quantity === '') {
      setErrors({ items: 'Product and adjusted quantity are required' });
      return;
    }

    const product = products.find((p) => p.id === currentItem.product_id);
    if (!product) return;

    const newItem = {
      ...currentItem,
      current_quantity: parseFloat(currentItem.current_quantity) || 0,
      adjusted_quantity: parseFloat(currentItem.adjusted_quantity),
      difference: parseFloat(currentItem.adjusted_quantity) - (parseFloat(currentItem.current_quantity) || 0),
      product_name: product.name,
      product_code: product.code,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    // Reset current item
    setCurrentItem({
      product_id: '',
      current_quantity: '',
      adjusted_quantity: '',
      difference: 0,
      unit: product.unit || '',
      reason: '',
    });

    setErrors({});
  };

  // Remove item from adjustment
  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
    if (!formData.location_id) newErrors.location_id = 'Location is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  // Adjustment reasons
  const adjustmentReasons = [
    { value: 'inventory_count', label: 'Inventory Count' },
    { value: 'damaged', label: 'Damaged Goods' },
    { value: 'expired', label: 'Expired Items' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'found', label: 'Found Items' },
    { value: 'correction', label: 'Data Correction' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="adjustment-form">
      <div className="form-section">
        <h3>Adjustment Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="adjustment_number">Adjustment Number</label>
            <input
              type="text"
              id="adjustment_number"
              name="adjustment_number"
              value={formData.adjustment_number}
              onChange={handleChange}
              placeholder="Auto-generated if left empty"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="warehouse_id">Warehouse *</label>
            <select
              id="warehouse_id"
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              required
            >
              <option value="">Select warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
            </select>
            {errors.warehouse_id && <span className="error-text">{errors.warehouse_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location_id">Location *</label>
            <select
              id="location_id"
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              required
              disabled={!formData.warehouse_id}
            >
              <option value="">Select location</option>
              {filteredLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} ({location.code})
                </option>
              ))}
            </select>
            {errors.location_id && <span className="error-text">{errors.location_id}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason *</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          >
            <option value="">Select reason</option>
            {adjustmentReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
          {errors.reason && <span className="error-text">{errors.reason}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Additional notes..."
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Items</h3>
        
        {errors.items && <div className="alert alert-error">{errors.items}</div>}

        <div className="item-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product_id">Product *</label>
              <select
                id="product_id"
                name="product_id"
                value={currentItem.product_id}
                onChange={(e) => {
                  handleItemChange(e);
                  handleProductSelect(e.target.value);
                }}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="current_quantity">Current Quantity</label>
              <input
                type="number"
                id="current_quantity"
                name="current_quantity"
                value={currentItem.current_quantity}
                onChange={handleItemChange}
                min="0"
                step="0.01"
                placeholder="Auto-filled"
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adjusted_quantity">Adjusted Quantity *</label>
              <input
                type="number"
                id="adjusted_quantity"
                name="adjusted_quantity"
                value={currentItem.adjusted_quantity}
                onChange={handleItemChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="difference">Difference</label>
              <input
                type="number"
                id="difference"
                name="difference"
                value={currentItem.difference}
                readOnly
                className={`readonly-input ${currentItem.difference > 0 ? 'positive' : currentItem.difference < 0 ? 'negative' : ''}`}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={currentItem.unit}
                onChange={handleItemChange}
                placeholder="pcs, kg, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="item_reason">Item Reason</label>
              <input
                type="text"
                id="item_reason"
                name="reason"
                value={currentItem.reason}
                onChange={handleItemChange}
                placeholder="Reason for this adjustment"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            + Add Item
          </Button>
        </div>

        {formData.items.length > 0 && (
          <div className="items-list">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Qty</th>
                  <th>Adjusted Qty</th>
                  <th>Difference</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name} ({item.product_code})</td>
                    <td>{item.current_quantity}</td>
                    <td>{item.adjusted_quantity}</td>
                    <td className={item.difference > 0 ? 'positive' : item.difference < 0 ? 'negative' : ''}>
                      {item.difference > 0 ? '+' : ''}{item.difference}
                    </td>
                    <td>{item.unit || '-'}</td>
                    <td>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Adjustment' : 'Create Adjustment'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AdjustmentForm;