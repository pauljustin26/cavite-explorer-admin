import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const adminEmail = JSON.parse(localStorage.getItem('adminProfile') || '{}').email;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminProfile');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Persistent Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Cavite Explorer</h2>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="block p-3 rounded hover:bg-slate-800 transition">Dashboard</Link>
          <Link to="/places/add" className="block p-3 rounded bg-blue-600 font-medium">Add Place</Link>
          <Link to="/settings" className="block p-3 rounded hover:bg-slate-800 transition">Game Settings</Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 mb-3 px-2">Logged in as: {adminEmail}</div>
          <button onClick={handleLogout} className="w-full text-left text-sm text-red-400 hover:bg-slate-800 p-2 rounded">
            ← Logout
          </button>
        </div>
      </aside>

      {/* Dynamic Page Content goes here! */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet /> 
      </main>
    </div>
  );
}