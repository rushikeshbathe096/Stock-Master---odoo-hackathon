import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

/**
 * DeliveryForm Component - For outgoing stock deliveries
 * @param {object} initialData - Initial form data (for editing)
 * @param {function} onSubmit - Submit handler
 * @param {function} onCancel - Cancel handler
 * @param {boolean} loading - Loading state
 * @param {Array} products - Available products list
 * @param {Array} warehouses - Available warehouses list
 * @param {Array} locations - Available locations list
 */
const DeliveryForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  products = [],
  warehouses = [],
  locations = [],
}) => {
  const [formData, setFormData] = useState({
    delivery_number: '',
    date: new Date().toISOString().split('T')[0],
    warehouse_id: '',
    location_id: '',
    customer: '',
    reference: '',
    notes: '',
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    product_id: '',
    quantity: '',
    unit: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        delivery_number: initialData.delivery_number || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        warehouse_id: initialData.warehouse_id || '',
        location_id: initialData.location_id || '',
        customer: initialData.customer || '',
        reference: initialData.reference || '',
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
    setCurrentItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add item to delivery
  const handleAddItem = () => {
    if (!currentItem.product_id || !currentItem.quantity) {
      setErrors({ items: 'Product and quantity are required' });
      return;
    }

    const product = products.find((p) => p.id === currentItem.product_id);
    if (!product) return;

    // Check if item already exists
    const existingIndex = formData.items.findIndex(
      (item) => item.product_id === currentItem.product_id
    );

    if (existingIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...formData.items];
      updatedItems[existingIndex].quantity += parseFloat(currentItem.quantity);
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        quantity: parseFloat(currentItem.quantity),
        product_name: product.name,
        product_code: product.code,
      };

      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }

    // Reset current item
    setCurrentItem({
      product_id: '',
      quantity: '',
      unit: product.unit || '',
      notes: '',
    });

    setErrors({});
  };

  // Remove item from delivery
  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Update item quantity
  const handleUpdateItemQuantity = (index, newQuantity) => {
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = parseFloat(newQuantity) || 0;
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
    if (!formData.location_id) newErrors.location_id = 'Location is required';
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';

    // Validate item quantities
    formData.items.forEach((item, index) => {
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}`] = 'Quantity must be greater than 0';
      }
    });

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

  // Calculate total quantity
  const totalQuantity = formData.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="delivery-form">
      <div className="form-section">
        <h3>Delivery Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="delivery_number">Delivery Number</label>
            <input
              type="text"
              id="delivery_number"
              name="delivery_number"
              value={formData.delivery_number}
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customer">Customer</label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reference">Reference</label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="SO number, invoice, etc."
            />
          </div>
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
                onChange={handleItemChange}
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
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={currentItem.quantity}
                onChange={handleItemChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

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
          </div>

          <div className="form-group">
            <label htmlFor="item_notes">Item Notes</label>
            <input
              type="text"
              id="item_notes"
              name="notes"
              value={currentItem.notes}
              onChange={handleItemChange}
              placeholder="Additional notes for this item"
            />
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
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name} ({item.product_code})</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQuantity(index, e.target.value)}
                        min="0"
                        step="0.01"
                        className="quantity-input"
                      />
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
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{totalQuantity.toFixed(2)}</strong></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Delivery' : 'Create Delivery'}
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

export default DeliveryForm;