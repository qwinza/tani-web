/**
 * MapSection Component
 * - "Sebaran Petani" section with interactive Leaflet map
 * - Uses OpenStreetMap tiles via Leaflet.js
 * - Custom markers with popups for farmer locations
 */
import { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Package, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom green marker icon for farmers
const farmerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function MapSection() {
    // Farmer locations state
    const [farmerLocations, setFarmerLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all public farmers
        fetch('/api/farmers')
            .then(res => res.json())
            .then(data => {
                // Map directly as the API already filters
                const farmers = data.map(farmer => ({
                    id: farmer.id,
                    name: farmer.name,
                    city: farmer.address ? farmer.address.split(',')[0] : 'Indonesia',
                    lat: parseFloat(farmer.latitude),
                    lng: parseFloat(farmer.longitude),
                    farmers: 1
                }));
                setFarmerLocations(farmers);
                setLoading(false);
            })
            .catch(err => console.error("Failed to load map data:", err));
    }, []);

    const stats = [
        { icon: Users, value: `${farmerLocations.length}+`, label: 'Petani Terdaftar' },
        { icon: MapPin, value: '34', label: 'Provinsi' },
        { icon: Package, value: '1.2K+', label: 'Produk Tersedia' },
    ];

    // Indonesia center coordinates
    const indonesiaCenter = [-2.5489, 118.0149];
    const defaultZoom = 5;

    return (
        <section id="peta" className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-6">
                        <Navigation className="w-4 h-4" />
                        Jangkauan Kami
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Sebaran{' '}
                        <span className="text-green-600">Petani</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Petani mitra kami tersebar di seluruh Indonesia, siap menyediakan
                        hasil pertanian berkualitas untuk Anda.
                    </p>
                </div>

                {/* Map Container with Leaflet */}
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="relative h-[500px]">
                        <MapContainer
                            center={indonesiaCenter}
                            zoom={defaultZoom}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
                            className="z-0"
                        >
                            {/* OpenStreetMap Tile Layer */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Farmer Location Markers */}
                            {farmerLocations.map((location) => (
                                <Marker
                                    key={location.id}
                                    position={[location.lat, location.lng]}
                                    icon={farmerIcon}
                                >
                                    <Popup>
                                        <div className="text-center p-2">
                                            <h3 className="font-bold text-green-700 text-lg mb-1">
                                                {location.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {location.city}
                                            </p>
                                            <div className="flex items-center justify-center gap-1 bg-green-100 rounded-full px-3 py-1">
                                                <Users className="w-4 h-4 text-green-600" />
                                                <span className="text-green-700 font-semibold">
                                                    Petani Verifikasi
                                                </span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Map Label Overlay */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Peta Interaktif</p>
                            <p className="text-sm font-medium text-gray-700">Klik marker untuk melihat detail</p>
                        </div>

                        {/* Legend Overlay */}
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Legenda</p>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-600 rounded-full" />
                                <span className="text-sm text-gray-700">Lokasi Petani</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mt-12 grid grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
