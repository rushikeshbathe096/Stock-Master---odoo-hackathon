import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

/**
 * ReceiptForm Component - For incoming stock receipts
 * @param {object} initialData - Initial form data (for editing)
 * @param {function} onSubmit - Submit handler
 * @param {function} onCancel - Cancel handler
 * @param {boolean} loading - Loading state
 * @param {Array} products - Available products list
 * @param {Array} warehouses - Available warehouses list
 * @param {Array} locations - Available locations list
 */
const ReceiptForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  products = [],
  warehouses = [],
  locations = [],
}) => {
  const [formData, setFormData] = useState({
    receipt_number: '',
    date: new Date().toISOString().split('T')[0],
    warehouse_id: '',
    location_id: '',
    supplier: '',
    reference: '',
    notes: '',
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    product_id: '',
    quantity: '',
    unit: '',
    lot_number: '',
    expiry_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        receipt_number: initialData.receipt_number || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        warehouse_id: initialData.warehouse_id || '',
        location_id: initialData.location_id || '',
        supplier: initialData.supplier || '',
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

  // Add item to receipt
  const handleAddItem = () => {
    if (!currentItem.product_id || !currentItem.quantity) {
      setErrors({ items: 'Product and quantity are required' });
      return;
    }

    const product = products.find((p) => p.id === currentItem.product_id);
    if (!product) return;

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

    // Reset current item
    setCurrentItem({
      product_id: '',
      quantity: '',
      unit: product.unit || '',
      lot_number: '',
      expiry_date: '',
      notes: '',
    });

    setErrors({});
  };

  // Remove item from receipt
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

  return (
    <form onSubmit={handleSubmit} className="receipt-form">
      <div className="form-section">
        <h3>Receipt Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="receipt_number">Receipt Number</label>
            <input
              type="text"
              id="receipt_number"
              name="receipt_number"
              value={formData.receipt_number}
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
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Enter supplier name"
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
              placeholder="PO number, invoice, etc."
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lot_number">Lot Number</label>
              <input
                type="text"
                id="lot_number"
                name="lot_number"
                value={currentItem.lot_number}
                onChange={handleItemChange}
                placeholder="Enter lot number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiry_date">Expiry Date</label>
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                value={currentItem.expiry_date}
                onChange={handleItemChange}
              />
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
                  <th>Lot Number</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name} ({item.product_code})</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit || '-'}</td>
                    <td>{item.lot_number || '-'}</td>
                    <td>{item.expiry_date || '-'}</td>
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
          {initialData ? 'Update Receipt' : 'Create Receipt'}
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

export default ReceiptForm;