// src/pages/move-history/MoveHistoryPage.jsx
import React, { useState } from 'react';

export default function MoveHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mocked move history data - replace with API data later
  const moves = [
    { id: 'M-1001', type: 'Receipt', item: 'Steel Rods', from: 'Supplier A', to: 'Main Warehouse', qty: 50, date: '2025-01-20', user: 'John Doe' },
    { id: 'M-1002', type: 'Delivery', item: 'Chairs', from: 'Warehouse A', to: 'Customer B', qty: 10, date: '2025-01-19', user: 'Jane Smith' },
    { id: 'M-1003', type: 'Adjustment', item: 'Bolts', from: 'Production Rack', to: 'Production Rack', qty: -5, date: '2025-01-18', user: 'John Doe' },
    { id: 'M-1004', type: 'Transfer', item: 'Screws', from: 'Main Warehouse', to: 'Rack B', qty: 200, date: '2025-01-17', user: 'Jane Smith' },
    { id: 'M-1005', type: 'Receipt', item: 'Wooden Planks', from: 'Supplier C', to: 'Main Warehouse', qty: 100, date: '2025-01-16', user: 'John Doe' },
  ];

  const filteredMoves = moves.filter(move =>
    move.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    move.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Move History</h1>
          <p className="text-sm text-gray-500 mt-1">Complete log of all inventory movements and transfers</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search moves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="receipt">Receipt</option>
            <option value="delivery">Delivery</option>
            <option value="adjustment">Adjustment</option>
            <option value="transfer">Transfer</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Moves Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">From</th>
                <th className="py-3 px-4">To</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">User</th>
              </tr>
            </thead>
            <tbody>
              {filteredMoves.map((move) => (
                <tr key={move.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{move.id}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        move.type === 'Receipt'
                          ? 'bg-blue-100 text-blue-800'
                          : move.type === 'Delivery'
                          ? 'bg-green-100 text-green-800'
                          : move.type === 'Adjustment'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {move.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{move.item}</td>
                  <td className="py-3 px-4">{move.from}</td>
                  <td className="py-3 px-4">{move.to}</td>
                  <td className={`py-3 px-4 font-medium ${move.qty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {move.qty > 0 ? '+' : ''}{move.qty}
                  </td>
                  <td className="py-3 px-4">{move.date}</td>
                  <td className="py-3 px-4">{move.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            Showing 1-{filteredMoves.length} of {filteredMoves.length} moves
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

