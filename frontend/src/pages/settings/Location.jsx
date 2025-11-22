// src/pages/settings/Location.jsx
import React, { useState } from 'react';

export default function Location() {
  const [locations, setLocations] = useState([
    { id: 'LOC-001', name: 'Main Warehouse', warehouse: 'Main Warehouse', type: 'Storage', status: 'Active' },
    { id: 'LOC-002', name: 'Production Rack', warehouse: 'Main Warehouse', type: 'Production', status: 'Active' },
    { id: 'LOC-003', name: 'Rack A', warehouse: 'Warehouse A', type: 'Storage', status: 'Active' },
    { id: 'LOC-004', name: 'Rack B', warehouse: 'Warehouse A', type: 'Storage', status: 'Active' },
    { id: 'LOC-005', name: 'Dispatch Area', warehouse: 'Distribution Center', type: 'Shipping', status: 'Active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    warehouse: '',
    type: 'Storage',
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
    const newLocation = {
      id: `LOC-${String(locations.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'Active',
    };
    setLocations([...locations, newLocation]);
    setFormData({ name: '', warehouse: '', type: 'Storage' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage storage locations within warehouses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Location'}
        </button>
      </div>

      {/* Add Location Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Add New Location</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse *</label>
                <select
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select warehouse</option>
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Warehouse A">Warehouse A</option>
                  <option value="Distribution Center">Distribution Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Storage">Storage</option>
                  <option value="Production">Production</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Receiving">Receiving</option>
                </select>
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
                Add Location
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{location.id}</td>
                  <td className="py-3 px-4">{location.name}</td>
                  <td className="py-3 px-4">{location.warehouse}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                      {location.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      {location.status}
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

