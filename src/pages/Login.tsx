import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Send Email and Password to Neon Auth
      const neonUrl = import.meta.env.VITE_NEON_AUTH_URL;
      const neonResponse = await fetch(`${neonUrl}/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const neonData = await neonResponse.json();
      
      if (!neonResponse.ok) {
        throw new Error(neonData.message || 'Invalid email or password.');
      }

      // 2. Dynamic Admin Check directly from the Neon database
      const userRole = neonData.user?.role; 

      if (userRole === 'admin') {
        // 🎉 VIP ACCESS GRANTED: Save tokens and Redirect!
        localStorage.setItem('adminToken', neonData.token);
        localStorage.setItem('adminProfile', JSON.stringify({ email: neonData.user?.email, role: 'admin' }));
        
        // Navigate to the secure dashboard
        navigate('/'); 
      } else {
        throw new Error('🚨 ACCESS DENIED: This dashboard is for administrators only.');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Cavite Explorer</h1>
        <p className="text-slate-500 text-sm text-center mb-6">Admin Portal Login</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition disabled:bg-slate-400"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}