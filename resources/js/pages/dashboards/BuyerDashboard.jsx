import { useState, useEffect } from 'react';
import { Leaf, LogOut, ShoppingBasket, ShoppingBag, History, User, Bell, Search, MapPin, Store, ChevronDown } from 'lucide-react';
import { CartProvider, useCart } from '../../context/CartContext';

// Sub-pages
import ProductMarket from './buyer/ProductMarket';
import ProductDetail from './buyer/ProductDetail';
import ShoppingCartUI from './buyer/ShoppingCart';
import OrderHistory from './buyer/OrderHistory';

function DashboardContent() {
    const [activeTab, setActiveTab] = useState('market');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const { cartCount, cartTotal } = useCart();
    const [user, setUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Failed to fetch user:", err));
    }, []);

    const handleLogout = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        await fetch('/api/logout', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': csrfToken }
        });
        window.location.href = '/login';
    };

    const handleProductSelect = (productId) => {
        setSelectedProductId(productId);
        setActiveTab('productDetail');
    };

    const handleBackToMarket = () => {
        setSelectedProductId(null);
        setActiveTab('market');
    };

    const renderContent = () => {
        try {
            switch (activeTab) {
                case 'cart': return <ShoppingCartUI />;
                case 'orders': return <OrderHistory />;
                case 'productDetail': return <ProductDetail productId={selectedProductId} onBack={handleBackToMarket} />;
                default: return <ProductMarket onProductSelect={handleProductSelect} />;
            }
        } catch (error) {
            return <div className="p-12 text-center text-red-500">Terjadi kesalahan saat memuat konten.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Top Navbar */}
            <header className="sticky top-4 z-50 px-4 md:px-8">
                <nav className="max-w-7xl mx-auto glass-morphism shadow-2xl shadow-emerald-900/5 rounded-[32px] px-6 py-4 flex justify-between items-center transition-all">
                    {/* Logo */}
                    <div
                        onClick={() => setActiveTab('market')}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black italic headline-gradient hidden sm:block">AgriMatch</span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setActiveTab('market')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'market' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/10' : 'text-slate-500 hover:text-emerald-600'}`}
                        >
                            <Store className="w-4 h-4" /> Pasar
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/10' : 'text-slate-500 hover:text-emerald-600'}`}
                        >
                            <History className="w-4 h-4" /> Pesanan
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Cart */}
                        <button
                            onClick={() => setActiveTab('cart')}
                            className={`relative p-3 rounded-2xl transition-all group ${activeTab === 'cart' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100'}`}
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 pr-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Akun Saya</p>
                                    <p className="text-xs font-black leading-none truncate max-w-[80px]">{user?.name?.split(' ')[0]}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                    <div className="px-6 py-2 border-b border-slate-50 mb-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Terdaftar sebagai</p>
                                        <p className="text-sm font-bold text-slate-900 italic">Pembeli AgriMatch</p>
                                    </div>
                                    <button className="w-full flex items-center gap-3 px-6 py-3 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all">
                                        <User className="w-4 h-4" />
                                        <span className="font-bold text-sm">Profil Lengkap</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-bold text-sm">Keluar Sesi</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {activeTab === 'market' && (
                    <div className="mb-12">
                        <div className="bg-emerald-600 rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <div className="relative z-10 max-w-xl">
                                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6">Penawaran Hari Ini</span>
                                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] font-outfit">Sayuran Segar Langsung Dari Kebun.</h2>
                                <p className="text-emerald-50 mb-8 font-medium">Dapatkan hasil tani terbaik dengan harga terjangkau dan bantu petani lokal berkembang bersama AgriMatch.</p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <img key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-white" src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="user" />
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold self-center"><span className="text-amber-400">1,200+</span> Orang telah berbelanja minggu ini</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="animate-in fade-in duration-700">
                    {renderContent()}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex justify-around items-center shadow-2xl">
                    <button onClick={() => setActiveTab('market')} className={`p-4 rounded-2xl transition-all ${activeTab === 'market' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}><Store className="w-6 h-6" /></button>
                    <button onClick={() => setActiveTab('cart')} className={`p-4 rounded-2xl transition-all relative ${activeTab === 'cart' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}>
                        <ShoppingBag className="w-6 h-6" />
                        {cartCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-slate-900"></span>}
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}><History className="w-6 h-6" /></button>
                </div>
            </div>
        </div>
    );
}

export default function BuyerDashboard() {
    return (
        <CartProvider>
            <DashboardContent />
        </CartProvider>
    );
}
