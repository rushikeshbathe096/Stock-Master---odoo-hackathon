// src/pages/stock/StockPage.jsx
import React, { useState } from 'react';

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mocked stock data - replace with API data later
  const stockItems = [
    { id: 'STK-001', product: 'Steel Rods', location: 'Main Warehouse', quantity: 1250, minLevel: 100, status: 'In Stock' },
    { id: 'STK-002', product: 'Bolts', location: 'Production Rack', quantity: 8500, minLevel: 500, status: 'In Stock' },
    { id: 'STK-003', product: 'Chairs', location: 'Warehouse A', quantity: 45, minLevel: 50, status: 'Low Stock' },
    { id: 'STK-004', product: 'Screws', location: 'Rack B', quantity: 0, minLevel: 200, status: 'Out of Stock' },
    { id: 'STK-005', product: 'Wooden Planks', location: 'Main Warehouse', quantity: 320, minLevel: 150, status: 'In Stock' },
  ];

  const filteredItems = stockItems.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stock Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage inventory levels across all locations</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Locations</option>
            <option value="main">Main Warehouse</option>
            <option value="production">Production Rack</option>
            <option value="warehouse-a">Warehouse A</option>
          </select>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-500">Total Products</div>
          <div className="mt-2 text-2xl font-semibold">{stockItems.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-500">In Stock</div>
          <div className="mt-2 text-2xl font-semibold text-green-600">
            {stockItems.filter(item => item.status === 'In Stock').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-500">Low Stock</div>
          <div className="mt-2 text-2xl font-semibold text-yellow-600">
            {stockItems.filter(item => item.status === 'Low Stock').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-500">Out of Stock</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">
            {stockItems.filter(item => item.status === 'Out of Stock').length}
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Min Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.id}</td>
                  <td className="py-3 px-4">{item.product}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4 font-medium">{item.quantity.toLocaleString()}</td>
                  <td className="py-3 px-4">{item.minLevel.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === 'In Stock'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs mr-3">View</button>
                    <button className="text-green-600 hover:underline text-xs">Update</button>
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

