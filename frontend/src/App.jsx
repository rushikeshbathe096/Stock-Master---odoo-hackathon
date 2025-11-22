// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Approutes';
import './index.css'; // Tailwind CSS entry


function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
export const SPEC_URL = '/mnt/data/StockMaster.pdf'; // local spec path. :contentReference[oaicite:1]{index=1}
