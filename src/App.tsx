import React from 'react'; // <-- 1. Add this import!
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; 
import Locations from './pages/Locations'; 
import Settings from './pages/Settings'; 

// 2. Change JSX.Element to React.ReactNode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>; 
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} /> 
          <Route path="locations" element={<Locations />} /> 
          <Route path="settings" element={<Settings  />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}