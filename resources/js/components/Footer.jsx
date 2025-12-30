/**
 * Footer Component
 * - Site links and navigation
 * - Social media links
 * - Copyright information
 */
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        Platform: [
            { name: 'Tentang Kami', href: '#tentang' },
            { name: 'Fitur', href: '#fitur' },
            { name: 'Cara Kerja', href: '#' },
            { name: 'Harga', href: '#' },
        ],
        Dukungan: [
            { name: 'Pusat Bantuan', href: '#' },
            { name: 'FAQ', href: '#' },
            { name: 'Kontak', href: '#kontak' },
            { name: 'Syarat & Ketentuan', href: '#' },
        ],
        Petani: [
            { name: 'Daftar Petani', href: '#' },
            { name: 'Dashboard', href: '#' },
            { name: 'Panduan Penjualan', href: '#' },
            { name: 'Tips Sukses', href: '#' },
        ],
        Pembeli: [
            { name: 'Cari Produk', href: '#' },
            { name: 'Peta Petani', href: '#peta' },
            { name: 'Panduan Pembelian', href: '#' },
            { name: 'Ulasan', href: '#' },
        ],
    };

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-6 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <a href="#beranda" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold">AgriMatch</span>
                        </a>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Platform marketplace pertanian yang menghubungkan petani lokal
                            dengan pembeli secara langsung. Membangun ekosistem pertanian
                            yang adil dan berkelanjutan.
                        </p>
                        <div className="space-y-3">
                            <a
                                href="mailto:hello@agrimatch.id"
                                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                hello@agrimatch.id
                            </a>
                            <a
                                href="tel:+6281234567890"
                                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                +62 812 3456 7890
                            </a>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                Jakarta, Indonesia
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-green-400 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Berlangganan Newsletter</h4>
                            <p className="text-gray-400">Dapatkan update terbaru dan tips pertanian.</p>
                        </div>
                        <form className="flex gap-3 w-full lg:w-auto">
                            <input
                                type="email"
                                placeholder="Masukkan email Anda"
                                className="flex-1 lg:w-80 px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap"
                            >
                                Berlangganan
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} AgriMatch. Hak cipta dilindungi.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Kebijakan Privasi
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Syarat Layanan
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
