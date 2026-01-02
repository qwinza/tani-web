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
    BarChart3
} from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: ShoppingBag,
            title: 'Transaksi Langsung',
            description: 'Beli langsung dari petani tanpa perantara. Harga lebih baik untuk petani dan pembeli.',
            color: 'green',
        },
        {
            icon: MapPin,
            title: 'Peta Petani',
            description: 'Temukan petani terdekat dengan peta interaktif. Lihat produk dan ketersediaan real-time.',
            color: 'blue',
        },
        {
            icon: LayoutDashboard,
            title: 'Dashboard Petani',
            description: 'Kelola produk, pantau penjualan, dan analisis performa dengan dashboard yang intuitif.',
            color: 'purple',
        },
        {
            icon: History,
            title: 'Riwayat Transaksi',
            description: 'Lacak semua transaksi dengan detail lengkap. Mudah untuk pembukuan dan referensi.',
            color: 'orange',
        },
        {
            icon: Shield,
            title: 'Pembayaran Aman',
            description: 'Sistem pembayaran terenkripsi dengan berbagai metode. Uang aman sampai barang diterima.',
            color: 'cyan',
        },
        {
            icon: Truck,
            title: 'Pengiriman Terlacak',
            description: 'Pantau pengiriman dari petani sampai ke tangan Anda dengan sistem tracking real-time.',
            color: 'pink',
        },
        {
            icon: MessageCircle,
            title: 'Chat Langsung',
            description: 'Komunikasi langsung dengan petani untuk diskusi produk, negosiasi, atau pertanyaan.',
            color: 'indigo',
        },
        {
            icon: BarChart3,
            title: 'Analisis Pasar',
            description: 'Akses data harga pasar dan tren untuk keputusan jual-beli yang lebih cerdas.',
            color: 'teal',
        },
    ];

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
        <section id="fitur" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100"
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${colorClasses[feature.color]} group-hover:text-white group-hover:scale-110`}>
                                <feature.icon className="w-7 h-7" />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Arrow */}
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
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
                        <button href="register" className="px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg whitespace-nowrap">
                            Daftar Gratis
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
