/**
 * MapSection Component
 * - "Sebaran Petani" section
 * - Placeholder map container (Leaflet/OpenStreetMap ready)
 * - Clean rounded UI with markers
 */
import { MapPin, Users, Package, Navigation } from 'lucide-react';

export default function MapSection() {
    // Sample farmer locations data
    const farmerLocations = [
        { id: 1, name: 'Jawa Barat', farmers: 150, top: '35%', left: '22%' },
        { id: 2, name: 'Jawa Tengah', farmers: 120, top: '38%', left: '35%' },
        { id: 3, name: 'Jawa Timur', farmers: 130, top: '40%', left: '48%' },
        { id: 4, name: 'Sumatera Utara', farmers: 80, top: '20%', left: '15%' },
        { id: 5, name: 'Sulawesi Selatan', farmers: 60, top: '45%', left: '65%' },
    ];

    const stats = [
        { icon: Users, value: '500+', label: 'Petani Terdaftar' },
        { icon: MapPin, value: '34', label: 'Provinsi' },
        { icon: Package, value: '1.2K+', label: 'Produk Tersedia' },
    ];

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

                {/* Map Container */}
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Map Background */}
                    <div className="relative h-[500px] bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
                        {/* Indonesia Map Silhouette (SVG simplified) */}
                        <svg
                            viewBox="0 0 800 400"
                            className="absolute inset-0 w-full h-full opacity-20"
                            fill="currentColor"
                        >
                            <path
                                className="text-green-600"
                                d="M100,180 Q150,150 200,170 Q250,190 280,175 Q320,160 350,180 Q380,200 420,185 Q460,170 500,190 Q540,210 580,195 Q620,180 660,200 Q700,220 720,200 L720,280 Q680,300 640,285 Q600,270 560,290 Q520,310 480,295 Q440,280 400,300 Q360,320 320,305 Q280,290 240,310 Q200,330 160,315 Q120,300 100,280 Z"
                            />
                        </svg>

                        {/* Animated Background Circles */}
                        <div className="absolute inset-0">
                            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-green-200/30 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-pulse delay-500" />
                            <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-emerald-200/30 rounded-full blur-2xl animate-pulse delay-1000" />
                        </div>

                        {/* Location Markers */}
                        {farmerLocations.map((location) => (
                            <div
                                key={location.id}
                                className="absolute group cursor-pointer"
                                style={{ top: location.top, left: location.left }}
                            >
                                {/* Pulse Ring */}
                                <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-ping" />
                                {/* Marker */}
                                <div className="relative w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                                        <p className="font-semibold">{location.name}</p>
                                        <p className="text-gray-300">{location.farmers} Petani</p>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                </div>
                            </div>
                        ))}

                        {/* Map Label */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Peta Interaktif</p>
                            <p className="text-sm font-medium text-gray-700">Hover untuk melihat detail lokasi</p>
                        </div>

                        {/* Legend */}
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
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
