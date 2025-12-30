/**
 * Hero Component
 * - Full-width background with agricultural theme
 * - Dark overlay for text readability
 * - Headline with green highlighted keywords
 * - CTA button "Mulai Sekarang"
 */
import { ArrowRight, Leaf, Users, TrendingUp } from 'lucide-react';

export default function Hero() {
    return (
        <section
            id="beranda"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                    }}
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-green-900/60" />
                {/* Animated Gradient Accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent" />
            </div>

            {/* Floating Elements Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-32 h-32 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-700" />
                <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-1000" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
                    <Leaf className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/90">Platform Pertanian Terpercaya</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
                    Hubungkan{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                        Petani
                    </span>{' '}
                    &{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                        Pembeli
                    </span>
                    <br />
                    dengan Cara yang Mudah
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up-delay">
                    AgriMatch menghubungkan petani lokal dengan pembeli secara langsung.
                    Dapatkan hasil pertanian segar dengan harga terbaik, tanpa perantara.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
                    <button className="group px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 flex items-center gap-2">
                        Mulai Sekarang
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                        Pelajari Lebih Lanjut
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-delay">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Users className="w-5 h-5 text-green-400 mr-2" />
                            <span className="text-3xl sm:text-4xl font-bold text-white">500+</span>
                        </div>
                        <p className="text-sm text-white/60">Petani Terdaftar</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                            <span className="text-3xl sm:text-4xl font-bold text-white">1.2K</span>
                        </div>
                        <p className="text-sm text-white/60">Transaksi Sukses</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Leaf className="w-5 h-5 text-green-400 mr-2" />
                            <span className="text-3xl sm:text-4xl font-bold text-white">50+</span>
                        </div>
                        <p className="text-sm text-white/60">Komoditas</p>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-down" />
                </div>
            </div>
        </section>
    );
}
