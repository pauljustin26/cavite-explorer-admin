import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AddPlace from './pages/AddPlace';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; // <-- Import the Dashboard

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes inside the Layout */}
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          
          {/* Map the root index to the Dashboard! */}
          <Route index element={<Dashboard />} /> 
          <Route path="places/add" element={<AddPlace />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}