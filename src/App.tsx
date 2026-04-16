import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; 
import Locations from './pages/Locations'; // <-- Import the new Locations page

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} /> 
          <Route path="locations" element={<Locations />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}