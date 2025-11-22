// src/pages/settings/Warehouse.jsx
import React, { useState } from 'react';

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState([
    { id: 'WH-001', name: 'Main Warehouse', address: '123 Main St, City', manager: 'John Doe', status: 'Active' },
    { id: 'WH-002', name: 'Warehouse A', address: '456 Oak Ave, City', manager: 'Jane Smith', status: 'Active' },
    { id: 'WH-003', name: 'Distribution Center', address: '789 Pine Rd, City', manager: 'Bob Johnson', status: 'Active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    manager: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWarehouse = {
      id: `WH-${String(warehouses.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'Active',
    };
    setWarehouses([...warehouses, newWarehouse]);
    setFormData({ name: '', address: '', manager: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Warehouses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage warehouse locations and settings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Warehouse'}
        </button>
      </div>

      {/* Add Warehouse Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Add New Warehouse</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager *</label>
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Warehouse
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Warehouses Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{warehouse.id}</td>
                  <td className="py-3 px-4">{warehouse.name}</td>
                  <td className="py-3 px-4">{warehouse.address}</td>
                  <td className="py-3 px-4">{warehouse.manager}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      {warehouse.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                    <button className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

