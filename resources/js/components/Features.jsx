/**
 * Features Component
 * - Grid/card layout for platform features
 * - Features: Direct transactions, Farmer map, Dashboard, Transaction history
 * - Modern card design with hover effects
 */
import {
    ShoppingBag,
    MapPin,
    LayoutDashboard,
    History,
    Shield,
    Truck,
    MessageCircle,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Features() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await axios.get('/api/features');
                setFeatures(response.data);
            } catch (error) {
                console.error('Error fetching features:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    const iconMap = {
        ShoppingBag,
        MapPin,
        LayoutDashboard,
        History,
        Shield,
        Truck,
        MessageCircle,
        BarChart3,
        ArrowRight
    };

    const colorClasses = {
        green: 'bg-green-100 text-green-600 group-hover:bg-green-600',
        blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600',
        purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600',
        orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600',
        cyan: 'bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600',
        pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-600',
        indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600',
        teal: 'bg-teal-100 text-teal-600 group-hover:bg-teal-600',
    };

    return (
        <section id="fitur" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-60" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-6">
                        Fitur Unggulan
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Semua yang Anda{' '}
                        <span className="text-green-600">Butuhkan</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Fitur lengkap untuk memudahkan transaksi antara petani dan pembeli.
                        Didesain untuk pengalaman terbaik.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
                    {loading ? (
                        // Loading Skeletons
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="p-8 bg-gray-50 rounded-3xl animate-pulse">
                                <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-6"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded-full w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                            </div>
                        ))
                    ) : (
                        features.map((feature, index) => {
                            const IconComponent = iconMap[feature.icon] || ShoppingBag;
                            return (
                                <div
                                    key={feature.id || index}
                                    className={`group relative p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-transparent hover:border-green-100 animate-slide-up`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${colorClasses[feature.color]} group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                                        <IconComponent className="w-7 h-7" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Arrow */}
                                    <div className="mt-6 flex items-center gap-2 text-green-600 font-semibold text-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        <span>Selengkapnya</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* CTA Banner */}
                <div className="mt-16 relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 sm:p-12">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full" />
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                Siap Bergabung dengan AgriMatch?
                            </h3>
                            <p className="text-green-100">
                                Daftar sekarang dan mulai transaksi dengan petani lokal.
                            </p>
                        </div>
                        <Link 
                            href="/register" 
                            className="px-8 py-4 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
                        >
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
