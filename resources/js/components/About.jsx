/**
 * About Component
 * - Platform description and mission
 * - Focus on transparency, fair pricing, sustainability
 * - Modern clean layout with visual elements
 */
import { Shield, Scale, Sprout, Heart } from 'lucide-react';

export default function About() {
    const values = [
        {
            icon: Shield,
            title: 'Transparansi',
            description: 'Informasi lengkap tentang produk dan petani untuk keputusan yang tepat.',
        },
        {
            icon: Scale,
            title: 'Keadilan Harga',
            description: 'Harga yang adil bagi petani dan terjangkau untuk pembeli.',
        },
        {
            icon: Sprout,
            title: 'Keberlanjutan',
            description: 'Mendukung praktik pertanian berkelanjutan untuk masa depan.',
        },
        {
            icon: Heart,
            title: 'Komunitas',
            description: 'Membangun hubungan kuat antara petani dan konsumen.',
        },
    ];

    return (
        <section id="tentang" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-6">
                            Tentang Kami
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Menghubungkan{' '}
                            <span className="text-green-600">Hasil Pertanian</span>
                            <br />
                            dengan Konsumen
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            AgriMatch adalah platform marketplace pertanian inovatif yang
                            menghubungkan petani lokal langsung dengan pembeli. Kami percaya
                            bahwa setiap petani berhak mendapatkan akses pasar yang adil, dan
                            setiap konsumen berhak mendapatkan produk pertanian berkualitas
                            dengan harga transparan.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Dengan teknologi modern dan jaringan yang luas, kami memudahkan
                            transaksi, memangkas rantai distribusi, dan memastikan hasil
                            pertanian sampai ke tangan konsumen dalam kondisi segar.
                        </p>
                    </div>

                    {/* Right - Image Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1607688387751-c1e95ae09a42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                        alt="Petani bekerja"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                        alt="Hasil panen"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                        alt="Sayuran segar"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                        alt="Transaksi pasar"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">🌾</span>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">5+</p>
                                    <p className="text-sm text-gray-500">Tahun Pengalaman</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="group p-6 bg-gray-50 rounded-2xl hover:bg-green-600 transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-green-100 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                <value.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors">
                                {value.title}
                            </h3>
                            <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
