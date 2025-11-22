// src/pages/operations/receipts/ReceiptsList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ReceiptsList() {
  // Mocked receipts data - replace with API data later
  const receipts = [
    { id: 'REC-1001', supplier: 'ABC Supplies', items: 5, total: '$1,250.00', date: '2025-01-20', status: 'Completed' },
    { id: 'REC-1002', supplier: 'XYZ Corp', items: 3, total: '$850.00', date: '2025-01-19', status: 'Pending' },
    { id: 'REC-1003', supplier: 'Global Imports', items: 8, total: '$2,100.00', date: '2025-01-18', status: 'Completed' },
    { id: 'REC-1004', supplier: 'Local Distributor', items: 2, total: '$450.00', date: '2025-01-17', status: 'In Transit' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Receipts</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage incoming stock receipts</p>
        </div>
        <Link
          to="/operations/receipts/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Receipt
        </Link>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search receipts..."
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

      {/* Receipts Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{receipt.id}</td>
                  <td className="py-3 px-4">{receipt.supplier}</td>
                  <td className="py-3 px-4">{receipt.items}</td>
                  <td className="py-3 px-4 font-medium">{receipt.total}</td>
                  <td className="py-3 px-4">{receipt.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        receipt.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : receipt.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {receipt.status}
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
            Showing 1-{receipts.length} of {receipts.length} receipts
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

