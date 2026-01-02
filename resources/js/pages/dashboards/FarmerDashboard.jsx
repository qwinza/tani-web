import { useState, useEffect } from 'react';
import { Leaf, LogOut, Package, ShoppingBag, Plus, Bell, TrendingUp, Search, Store, ChevronDown, User } from 'lucide-react';
import ProductManagement from './farmer/ProductManagement';
import FarmerOrders from './farmer/FarmerOrders';
import FarmerProfile from './farmer/FarmerProfile';

export default function FarmerDashboard() {
    const [activeTab, setActiveTab] = useState('products');
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

    const renderContent = () => {
        try {
            switch (activeTab) {
                case 'orders': return <FarmerOrders />;
                case 'profile': return <FarmerProfile />;
                default: return <ProductManagement />;
            }
        } catch (error) {
            return <div className="p-12 text-center text-red-500">Terjadi kesalahan saat memuat dashboard petani.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Top Navbar */}
            <header className="sticky top-4 z-50 px-4 md:px-8">
                <nav className="max-w-7xl mx-auto glass-morphism shadow-2xl shadow-amber-900/5 rounded-[32px] px-6 py-4 flex justify-between items-center transition-all border-amber-100/20">
                    {/* Logo */}
                    <div 
                        onClick={() => setActiveTab('products')}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black italic text-amber-600 hidden sm:block font-outfit">AgriMatch</span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button 
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-amber-500 text-slate-900 shadow-xl shadow-amber-500/10' : 'text-slate-500 hover:text-amber-600'}`}
                        >
                            <Package className="w-4 h-4" /> Produk Saya
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-amber-500 text-slate-900 shadow-xl shadow-amber-500/10' : 'text-slate-500 hover:text-amber-600'}`}
                        >
                            <ShoppingBag className="w-4 h-4" /> Pesanan Masuk
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Stats shortcut */}
                        <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-bold text-xs">
                             <TrendingUp className="w-3.5 h-3.5" /> Stats: Stabil
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 pr-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm">
                                    {user?.name ? user.name.charAt(0) : 'P'}
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Area Petani</p>
                                    <p className="text-xs font-black leading-none truncate max-w-[80px]">{user?.name ? user.name.split(' ')[0] : 'Petani'}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                     <div className="px-6 py-2 border-b border-slate-50 mb-2">
                                         <p className="text-[10px] font-black text-slate-400 uppercase">Peran Sistem</p>
                                         <p className="text-sm font-bold text-amber-600 italic">Petani Terverifikasi</p>
                                     </div>
                                     <button 
                                        onClick={() => { setActiveTab('profile'); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-3 px-6 py-3 text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-all"
                                     >
                                         <User className="w-4 h-4" />
                                         <span className="font-bold text-sm">Profil & Lokasi</span>
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
                {activeTab === 'products' && (
                    <div className="mb-12">
                        <div className="bg-slate-900 rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <div className="relative z-10 max-w-2xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
                                    <span className="text-xs font-bold text-slate-400">Pusat Manajemen Hasil Tani</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] font-outfit">Kelola Hasil Panenmu <br/><span className="text-amber-500 underline underline-offset-8 decoration-4">Lebih Maksimal.</span></h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                                     <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Order Aktif</p>
                                         <p className="text-2xl font-black text-amber-500">12</p>
                                     </div>
                                     <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Stok Rendah</p>
                                         <p className="text-2xl font-black text-red-500">3</p>
                                     </div>
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
                 <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex justify-around items-center shadow-2xl">
                      <button onClick={() => setActiveTab('products')} className={`p-4 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}><Package className="w-6 h-6" /></button>
                      <button onClick={() => setActiveTab('orders')} className={`p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}><ShoppingBag className="w-6 h-6" /></button>
                 </div>
            </div>
        </div>
    );
}
