// src/components/layout/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const topTabs = [
  { label: 'DASHBOARD', to: '/dashboard' },
  { label: 'OPERATIONS', to: '/operations/receipts' }, // goes to receipts by default
  { label: 'STOCK', to: '/stock' },
  { label: 'MOVE HISTORY', to: '/move-history' },
  { label: 'SETTINGS', to: '/settings/warehouse' },
];

export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: App title */}
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold">StockMaster</div>

            {/* Top nav tabs */}
            <nav className="flex space-x-2">
              {topTabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: profile link */}
          <div>
            <NavLink
              to="/profile"
              className="px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
