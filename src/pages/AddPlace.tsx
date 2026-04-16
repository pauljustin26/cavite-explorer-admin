import { useState } from 'react';

export default function AddPlace() {
  const [name, setName] = useState('');
  const [municipality, setMunicipality] = useState('Kawit'); // Default to Kawit!
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const placeData = {
      name,
      municipality,
      description,
      latitude: parseFloat(latitude), // Ensure these are numbers for Postgres
      longitude: parseFloat(longitude)
    };

    try {
      // Get the token you saved during login
      const token = localStorage.getItem('adminToken');

      // Send the data to your NestJS Backend
      const response = await fetch('http://localhost:3000/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Prove you are an admin
        },
        body: JSON.stringify(placeData)
      });

      if (!response.ok) throw new Error('Failed to save to database');

      setMessage('✅ Location added successfully!');
      
      // Clear the form
      setName(''); setDescription(''); setLatitude(''); setLongitude('');
      
    } catch (error) {
      setMessage('🚨 Error saving location. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Historical Place</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Place Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Place Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="e.g., Aguinaldo Shrine"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Municipality Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Municipality (Category)</label>
              <select 
                value={municipality} onChange={(e) => setMunicipality(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Kawit">Kawit</option>
                <option value="Imus">Imus</option>
                <option value="Bacoor">Bacoor</option>
                <option value="Dasmariñas">Dasmariñas</option>
                {/* Add more Cavite towns here later! */}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Brief Description</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
              placeholder="Write a brief history for the players..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Map Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Latitude</label>
              <input 
                type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required
                placeholder="14.4445"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Longitude</label>
              <input 
                type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required
                placeholder="120.9039"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
            >
              {isSubmitting ? 'Saving to Database...' : 'Save Location'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}