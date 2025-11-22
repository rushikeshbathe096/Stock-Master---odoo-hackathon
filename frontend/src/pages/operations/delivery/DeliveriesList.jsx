// src/pages/operations/delivery/DeliveriesList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function DeliveriesList() {
  // Mocked deliveries data - replace with API data later
  const deliveries = [
    { id: 'DEL-1001', customer: 'Customer A', items: 3, total: '$750.00', date: '2025-01-20', status: 'Completed' },
    { id: 'DEL-1002', customer: 'Customer B', items: 5, total: '$1,200.00', date: '2025-01-19', status: 'Pending' },
    { id: 'DEL-1003', customer: 'Customer C', items: 2, total: '$450.00', date: '2025-01-18', status: 'In Transit' },
    { id: 'DEL-1004', customer: 'Customer D', items: 4, total: '$980.00', date: '2025-01-17', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Deliveries</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage outgoing stock deliveries</p>
        </div>
        <Link
          to="/operations/delivery/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          New Delivery
        </Link>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search deliveries..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
          </select>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{delivery.id}</td>
                  <td className="py-3 px-4">{delivery.customer}</td>
                  <td className="py-3 px-4">{delivery.items}</td>
                  <td className="py-3 px-4 font-medium">{delivery.total}</td>
                  <td className="py-3 px-4">{delivery.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        delivery.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : delivery.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs mr-3">View</button>
                    <button className="text-green-600 hover:underline text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            Showing 1-{deliveries.length} of {deliveries.length} deliveries
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

