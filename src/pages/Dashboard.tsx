import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define the shape of our data so TypeScript can help us out
interface Place {
  id: string; // Or number, depending on how you set up your Neon table
  name: string;
  municipality: string;
  latitude: number;
  longitude: number;
  // description is also there, but we don't need to show it in the table
}

export default function Dashboard() {
  const adminProfile = JSON.parse(localStorage.getItem('adminProfile') || '{}');
  
  // State to hold our real database data
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data when the dashboard loads
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:3000/places');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setPlaces(data); // Save the Neon data into React state!
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your Cavite Explorer game data.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Logged in as: <span className="font-semibold text-slate-700">{adminProfile?.email || 'Admin'}</span>
        </div>
      </div>
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Historical Places</h3>
          <p className="text-4xl font-bold text-slate-800 mt-2">{isLoading ? '...' : places.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Players</h3>
          <p className="text-4xl font-bold text-slate-800 mt-2">1,402</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Badges Awarded</h3>
          <p className="text-4xl font-bold text-slate-800 mt-2">856</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Historical Locations Database</h2>
          <Link to="/places/add" className="text-sm text-blue-600 font-semibold hover:text-blue-700">
            + Add New Place
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-3 font-semibold">Location Name</th>
                <th className="px-6 py-3 font-semibold">Municipality</th>
                <th className="px-6 py-3 font-semibold">Coordinates</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              
              {/* Show a loading state while fetching */}
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Loading locations from database...
                  </td>
                </tr>
              )}

              {/* Show empty state if database has no rows */}
              {!isLoading && places.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No locations found. Click "Add New Place" to get started.
                  </td>
                </tr>
              )}

              {/* Map over the actual data and generate rows dynamically */}
              {places.map((place, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{place.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">
                      {place.municipality}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {place.latitude}° N, {place.longitude}° E
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}