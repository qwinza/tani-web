import { useState, useEffect } from 'react';
import { MapPin, Save, Loader2, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Lokasi Anda</Popup>
        </Marker>
    );
}

export default function FarmerProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: ''
    });
    const [mapCenter, setMapCenter] = useState([-2.5489, 118.0149]); // Default Indonesia

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setFormData({
                    name: data.name || '',
                    address: data.address || '',
                    latitude: data.latitude || '',
                    longitude: data.longitude || ''
                });
                if (data.latitude && data.longitude) {
                    setMapCenter([data.latitude, data.longitude]);
                }
                setLoading(false);
            });
    }, []);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({ ...prev, latitude, longitude }));
                    setMapCenter([latitude, longitude]);
                },
                (error) => {
                    alert("Gagal mendapatkan lokasi: " + error.message);
                }
            );
        } else {
            alert("Browser tidak mendukung Geolocation.");
        }
    };

    const handleMapClick = (latlng) => {
        setFormData(prev => ({
            ...prev,
            latitude: latlng.lat,
            longitude: latlng.lng
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                alert('Profil berhasil diperbarui!');
            } else {
                alert('Gagal menyimpan profil.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Memuat...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-[40px] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 font-outfit">Profil & Lokasi</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Alamat Lengkap</label>
                    <textarea 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 h-24 resize-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Masukkan alamat lengkap kebun/gudang..."
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Titik Lokasi (Peta)</label>
                        <button 
                            type="button" 
                            onClick={handleGetLocation}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-colors"
                        >
                            <Navigation className="w-3 h-3" /> Ambil Lokasi Saya
                        </button>
                    </div>

                    <div className="h-[400px] rounded-3xl overflow-hidden border border-slate-200 relative z-0">
                         <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker 
                                position={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null} 
                                setPosition={handleMapClick}
                            />
                        </MapContainer>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            value={formData.latitude} 
                            placeholder="Latitude" 
                            readOnly 
                            className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-mono text-slate-500"
                        />
                         <input 
                            type="text" 
                            value={formData.longitude} 
                            placeholder="Longitude" 
                            readOnly 
                            className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-mono text-slate-500"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Simpan Profil
                </button>
            </form>
        </div>
    );
}
