// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Auth
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Pages (ensure these files exist per your structure)
import Dashboard from '../pages/dashboard/dashboard';
import ReceiptsList from '../pages/operations/receipts/ReceiptsList';
import ReceiptCreate from '../pages/operations/receipts/ReceiptCreate';
import DeliveriesList from '../pages/operations/delivery/DeliveriesList';
import DeliveryCreate from '../pages/operations/delivery/DeliveryCreate';
import AdjustmentsList from '../pages/operations/adjustments/AdjustmentsList';
import AdjustmentCreate from '../pages/operations/adjustments/AdjustmentCreate';
import StockPage from '../pages/stock/StockPage';
import MoveHistoryPage from '../pages/move-history/MoveHistoryPage';
import Warehouse from '../pages/settings/Warehouse';
import Location from '../pages/settings/Location';
import Profile from '../pages/profile/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Operations */}
        <Route path="operations/receipts" element={<ReceiptsList />} />
        <Route path="operations/receipts/new" element={<ReceiptCreate />} />

        <Route path="operations/delivery" element={<DeliveriesList />} />
        <Route path="operations/delivery/new" element={<DeliveryCreate />} />

        <Route path="operations/adjustments" element={<AdjustmentsList />} />
        <Route path="operations/adjustments/new" element={<AdjustmentCreate />} />

        {/* Stock, Move History, Settings */}
        <Route path="stock" element={<StockPage />} />
        <Route path="move-history" element={<MoveHistoryPage />} />

        <Route path="settings/warehouse" element={<Warehouse />} />
        <Route path="settings/locations" element={<Location />} />

        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
