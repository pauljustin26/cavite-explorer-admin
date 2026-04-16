import { useState, useEffect } from 'react';
import { Plus, X, Edit } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  municipality: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
  badgeImage: string;
}

export default function Locations() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // NEW: Tracks if we are editing!
  
  // Form Fields
  const [name, setName] = useState('');
  const [municipality, setMunicipality] = useState('Kawit');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagesInput, setImagesInput] = useState(''); // Comma separated URLs
  const [badgeImage, setBadgeImage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlaces = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/places`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // NEW: Opens modal and fills it with the existing data
  const handleEditClick = (place: Place) => {
    setEditingId(place.id);
    setName(place.name);
    setMunicipality(place.municipality);
    setDescription(place.description || '');
    setLatitude(place.latitude.toString());
    setLongitude(place.longitude.toString());
    setBadgeImage(place.badgeImage || '');
    // Convert array back to comma-separated string for the text input
    setImagesInput(place.images ? place.images.join(', ') : ''); 
    setIsModalOpen(true);
  };

  // NEW: Resets form completely for a fresh "Add"
  const handleAddClick = () => {
    setEditingId(null);
    setName(''); setMunicipality('Kawit'); setDescription(''); 
    setLatitude(''); setLongitude(''); setImagesInput(''); setBadgeImage('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert the comma-separated string into a proper array of strings!
    const imagesArray = imagesInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const placeData = {
      name, municipality, description,
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude),
      images: imagesArray,
      badgeImage
    };

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // If we have an editingId, do a PUT request. Otherwise, POST.
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/places/${editingId}` : `${API_URL}/places`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(placeData)
      });

      if (!response.ok) throw new Error('Failed to save');

      await fetchPlaces();
      setIsModalOpen(false);
    } catch (error) {
      alert('Error saving location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Landmarks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage historical locations in the database.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} />
          Add Location
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Municipality</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
            {isLoading && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>}
            {!isLoading && places.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No locations found.</td></tr>}
            {places.map((place) => (
              <tr key={place.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{place.name}</td>
                <td className="px-6 py-4">{place.municipality}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleEditClick(place)}
                    className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline"
                  >
                    <Edit size={14} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Location' : 'Add New Location'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Municipality</label>
                  <select value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                    <option value="Kawit">Kawit</option>
                    <option value="Imus">Imus</option>
                    <option value="Bacoor">Bacoor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Latitude</label>
                  <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Longitude</label>
                  <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono" />
                </div>
              </div>

              {/* NEW IMAGE FIELDS */}
              <div className="pt-4 border-t border-slate-100">
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location Images (Comma Separated URLs)
                  </label>
                  <textarea 
                    value={imagesInput} 
                    onChange={(e) => setImagesInput(e.target.value)} 
                    rows={2} 
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate multiple image links with a comma.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Badge Image URL</label>
                  <input 
                    type="text" 
                    value={badgeImage} 
                    onChange={(e) => setBadgeImage(e.target.value)} 
                    placeholder="https://link-to-badge.png"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Location' : 'Save Location')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}