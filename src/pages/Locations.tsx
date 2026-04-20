import { useState, useEffect } from 'react';
import { Plus, X, Edit, Image as ImageIcon, MapPin } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  municipality: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
  badgeImage: string;
  gameType: string;
}

export default function Locations() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ADD/EDIT MODAL STATE ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); 
  
  // Form Fields
  const [name, setName] = useState('');
  const [municipality, setMunicipality] = useState('Kawit');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagesInput, setImagesInput] = useState(''); 
  const [badgeImage, setBadgeImage] = useState('');
  const [gameType, setGameType] = useState('quiz'); // NEW: Default to quiz
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- GALLERY MODAL STATE ---
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');

  const fetchPlaces = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.40:3000';
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

  // Open Form Modal for Editing
  const handleEditClick = (place: Place) => {
    setEditingId(place.id);
    setName(place.name);
    setMunicipality(place.municipality);
    setDescription(place.description || '');
    setLatitude(place.latitude.toString());
    setLongitude(place.longitude.toString());
    setBadgeImage(place.badgeImage || '');
    setGameType(place.gameType || 'quiz');
    setImagesInput(place.images && place.images.length > 0 ? place.images.join(', ') : ''); 
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Adding
  const handleAddClick = () => {
    setEditingId(null);
    setName(''); setMunicipality('Kawit'); setDescription(''); 
    setLatitude(''); setLongitude(''); setImagesInput(''); setBadgeImage(''); setGameType('quiz');
    setIsFormModalOpen(true);
  };

  // Open Gallery Modal
  const handleViewGallery = (place: Place) => {
    setGalleryImages(place.images || []);
    setGalleryTitle(place.name);
    setIsGalleryOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imagesArray = imagesInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const placeData = {
      name, municipality, description,
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude),
      images: imagesArray,
      badgeImage,
      gameType
    };

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.40:3000';
      
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
      setIsFormModalOpen(false);
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
          <h1 className="text-2xl font-bold text-slate-900">Landmarks Database</h1>
          <p className="text-sm text-slate-500 mt-1">Manage historical locations, minigames, and badges.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Location
        </button>
      </div>

      {/* --- ENHANCED DATA TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Badge</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coordinates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Game Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Photos</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading database...</td></tr>}
              {!isLoading && places.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No locations found.</td></tr>}
              
              {places.map((place) => (
                <tr key={place.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Badge Image Thumbnail */}
                  <td className="px-6 py-4">
                    {place.badgeImage ? (
                      <img src={place.badgeImage} alt="Badge" className="w-12 h-12 object-cover rounded-full border-2 border-slate-200 shadow-sm bg-white" />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">N/A</div>
                    )}
                  </td>

                  {/* Name & Description Stack */}
                  <td className="px-6 py-4 max-w-62.5">
                    <p className="font-bold text-slate-900 truncate">{place.name}</p>
                    <p className="text-xs font-medium text-slate-500 mb-1">{place.municipality}</p>
                    <p className="text-xs text-slate-400 truncate" title={place.description}>{place.description}</p>
                  </td>

                  {/* Coordinates */}
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-1"><MapPin size={12}/> {place.latitude}</div>
                    <div className="flex items-center gap-1 opacity-0"><MapPin size={12}/> {place.longitude}</div> {/* Invisible icon for alignment */}
                  </td>

                  {/* Game Type */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {place.gameType || 'quiz'}
                    </span>
                  </td>

                  {/* Photos Button */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleViewGallery(place)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <ImageIcon size={14} />
                      {place.images ? place.images.length : 0} Photos
                    </button>
                  </td>

                  {/* Edit Button */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditClick(place)}
                      className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs"
                    >
                      <Edit size={14} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT FORM MODAL --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Location Data' : 'Add New Location'}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm border border-slate-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Primary Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Municipality</label>
                  <select value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                    <option value="Kawit">Kawit</option>
                    <option value="Imus">Imus</option>
                    <option value="Bacoor">Bacoor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>

              {/* Coordinates & Game Type */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Latitude</label>
                  <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Longitude</label>
                  <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Game Type</label>
                  <select value={gameType} onChange={(e) => setGameType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option value="quiz">Quiz</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="ar">AR Mode</option>
                  </select>
                </div>
              </div>

              {/* Assets */}
              <div className="pt-4 border-t border-slate-100">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location Images (Comma Separated URLs)</label>
                  <textarea 
                    value={imagesInput} 
                    onChange={(e) => setImagesInput(e.target.value)} 
                    rows={2} 
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Badge Image URL</label>
                  <input 
                    type="text" 
                    value={badgeImage} 
                    onChange={(e) => setBadgeImage(e.target.value)} 
                    placeholder="https://link-to-badge.png"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm">
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Location' : 'Save Location')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- IMAGE GALLERY MODAL --- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Photos: {galleryTitle}
              </h3>
              <button onClick={() => setIsGalleryOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              {galleryImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No images have been uploaded for this location.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((url, idx) => (
                    <div key={idx} className="aspect-video bg-slate-200 rounded-lg overflow-hidden shadow-sm border border-slate-200 group relative">
                      <img 
                        src={url} 
                        alt={`${galleryTitle} ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Failed+To+Load';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}