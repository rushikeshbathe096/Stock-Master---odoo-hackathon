// src/pages/dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SPEC_URL } from '../../App'; // App exports SPEC_URL

export default function Dashboard() {
  // mocked KPI values — replace with API data later
  const kpis = [
    { label: 'Total Products in Stock', value: '1,254' },
    { label: 'Low / Out of Stock', value: '18' },
    { label: 'Pending Receipts', value: '4' },
    { label: 'Pending Deliveries', value: '7' },
    { label: 'Internal Transfers Scheduled', value: '2' },
  ];

  // mocked recent moves
  const recentMoves = [
    { id: 'M-1001', item: 'Steel Rods', from: 'Main', to: 'Production Rack', qty: '50', date: '2025-11-20' },
    { id: 'M-1002', item: 'Chairs', from: 'Warehouse A', to: 'Dispatch', qty: '10', date: '2025-11-19' },
    { id: 'M-1003', item: 'Bolts', from: 'Main', to: 'Rack B', qty: '200', date: '2025-11-18' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Snapshot of inventory operations</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={SPEC_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            View Spec
          </a>
          <Link
            to="/profile"
            className="text-sm px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">{k.label}</div>
            <div className="mt-2 text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/operations/receipts" className="p-4 rounded-lg bg-white shadow hover:shadow-md">
          <div className="text-sm text-gray-500">Operations</div>
          <div className="mt-2 font-semibold">Receipts · Delivery · Adjustments</div>
        </Link>

        <Link to="/stock" className="p-4 rounded-lg bg-white shadow hover:shadow-md">
          <div className="text-sm text-gray-500">Stock</div>
          <div className="mt-2 font-semibold">View & Update Stock</div>
        </Link>

        <Link to="/move-history" className="p-4 rounded-lg bg-white shadow hover:shadow-md">
          <div className="text-sm text-gray-500">Move History</div>
          <div className="mt-2 font-semibold">All transfers & logs</div>
        </Link>
      </div>

      {/* Recent Moves */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Recent Moves</h2>
          <Link to="/move-history" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500">
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Item</th>
                <th className="py-2">From</th>
                <th className="py-2">To</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentMoves.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="py-2">{m.id}</td>
                  <td className="py-2">{m.item}</td>
                  <td className="py-2">{m.from}</td>
                  <td className="py-2">{m.to}</td>
                  <td className="py-2">{m.qty}</td>
                  <td className="py-2">{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shortcuts / footers */}
      <div className="flex flex-wrap gap-3">
        <Link to="/operations/receipts/new" className="px-4 py-2 bg-blue-600 text-white rounded">
          New Receipt
        </Link>
        <Link to="/operations/delivery/new" className="px-4 py-2 bg-green-600 text-white rounded">
          New Delivery
        </Link>
        <Link to="/operations/adjustments/new" className="px-4 py-2 bg-yellow-500 text-white rounded">
          New Adjustment
        </Link>
      </div>
    </div>
  );
}
