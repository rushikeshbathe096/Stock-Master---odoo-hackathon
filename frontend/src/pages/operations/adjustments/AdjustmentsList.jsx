// src/pages/operations/adjustments/AdjustmentsList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AdjustmentsList() {
  // Mocked adjustments data - replace with API data later
  const adjustments = [
    { id: 'ADJ-1001', location: 'Main Warehouse', product: 'Steel Rods', quantity: -10, reason: 'Damaged Goods', date: '2025-01-20', status: 'Completed' },
    { id: 'ADJ-1002', location: 'Production Rack', product: 'Bolts', quantity: 50, reason: 'Found Inventory', date: '2025-01-19', status: 'Completed' },
    { id: 'ADJ-1003', location: 'Warehouse A', product: 'Chairs', quantity: -5, reason: 'Lost/Stolen', date: '2025-01-18', status: 'Pending' },
    { id: 'ADJ-1004', location: 'Rack B', product: 'Screws', quantity: 100, reason: 'Counting Error', date: '2025-01-17', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stock Adjustments</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage inventory adjustments</p>
        </div>
        <Link
          to="/operations/adjustments/new"
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          New Adjustment
        </Link>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search adjustments..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Locations</option>
            <option value="main">Main Warehouse</option>
            <option value="production">Production Rack</option>
            <option value="warehouse-a">Warehouse A</option>
          </select>
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adj) => (
                <tr key={adj.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{adj.id}</td>
                  <td className="py-3 px-4">{adj.location}</td>
                  <td className="py-3 px-4">{adj.product}</td>
                  <td className={`py-3 px-4 font-medium ${adj.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adj.quantity > 0 ? '+' : ''}{adj.quantity}
                  </td>
                  <td className="py-3 px-4">{adj.reason}</td>
                  <td className="py-3 px-4">{adj.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        adj.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {adj.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            Showing 1-{adjustments.length} of {adjustments.length} adjustments
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

