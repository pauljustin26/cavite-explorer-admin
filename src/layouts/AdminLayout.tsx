import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminProfile = JSON.parse(localStorage.getItem('adminProfile') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminProfile');
    navigate('/login');
  };

  const navItemClass = (path: string) => 
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path 
        ? 'bg-slate-900 text-white' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* Sleek, Light Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Cavite Explorer</h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/" className={navItemClass('/')}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/locations" className={navItemClass('/locations')}>
            <MapPin size={18} />
            Locations
          </Link>
          <Link to="/settings" className={navItemClass('/settings')}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="px-4 mb-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Admin</p>
            <p className="text-sm text-slate-700 truncate">{adminProfile?.email}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Clean Content Canvas */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}