import { useState, useEffect } from 'react';
import { Leaf, Users, Shield, Settings, LogOut, BarChart3, AlertCircle, TrendingUp, Megaphone, ShoppingBasket, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// Sub-pages
import AdminUsers from './admin/AdminUsers';
import AdminVerifyFarmers from './admin/AdminVerifyFarmers';
import AdminCategories from './admin/AdminCategories';
import AdminAnnouncements from './admin/AdminAnnouncements';
import AdminOrders from './admin/AdminOrders';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState({
        stats: { totalUsers: 0, totalFarmers: 0, pendingFarmers: 0, totalProducts: 0, totalOrders: 0, serverStatus: 'Loading...' },
        charts: { userDistribution: [] },
        recentUsers: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

    useEffect(() => {
        if (activeTab === 'overview') {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        await fetch('/api/logout', { 
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': csrfToken }
        });
        window.location.href = '/login';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <AdminUsers />;
            case 'verify': return <AdminVerifyFarmers />;
            case 'categories': return <AdminCategories />;
            case 'announcements': return <AdminAnnouncements />;
            case 'orders': return <AdminOrders />;
            default: return (
                <main className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-emerald-500 transition-all cursor-pointer" onClick={() => setActiveTab('users')}>
                            <p className="text-sm text-gray-500 mb-1">Total Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600">{data.stats.totalUsers}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-emerald-500 transition-all cursor-pointer relative" onClick={() => setActiveTab('verify')}>
                            {data.stats.pendingFarmers > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                                    {data.stats.pendingFarmers} baru
                                </span>
                            )}
                            <p className="text-sm text-gray-500 mb-1">Petani Aktif</p>
                            <h3 className="text-3xl font-bold text-emerald-600">{data.stats.totalFarmers}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-emerald-500 transition-all">
                            <p className="text-sm text-gray-500 mb-1">Produk Terdaftar</p>
                            <h3 className="text-3xl font-bold text-blue-600">{data.stats.totalProducts}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-emerald-500 transition-all cursor-pointer" onClick={() => setActiveTab('orders')}>
                            <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
                            <h3 className="text-3xl font-bold text-gray-900">{data.stats.totalOrders}</h3>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800">Distribusi Role User</h3>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.charts.userDistribution}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.charts.userDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                           <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800">Uptime & Sistem</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-500">Resource Usage</span>
                                        <span className="text-sm font-bold text-emerald-600">32%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Server Loc</p>
                                        <p className="font-bold text-gray-800">Jakarta, ID</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">PHP Version</p>
                                        <p className="font-bold text-gray-800">8.2.12</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen z-20">
                <div className="p-6 border-b border-slate-800 cursor-pointer" onClick={() => setActiveTab('overview')}>
                    <div className="flex items-center gap-2">
                        <Leaf className="w-8 h-8 text-emerald-500" />
                        <span className="text-xl font-bold italic">AgriMatch</span>
                    </div>
                    <p className="text-[10px] text-emerald-500 font-bold tracking-widest mt-1">SUPERADMIN PANEL</p>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <BarChart3 className="w-5 h-5" /> Ringkasan
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Users className="w-5 h-5" /> Kelola User
                    </button>
                    <button 
                        onClick={() => setActiveTab('verify')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'verify' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Shield className="w-5 h-5" /> Verifikasi Petani
                    </button>
                    <button 
                        onClick={() => setActiveTab('categories')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'categories' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Layers className="w-5 h-5" /> Kategori
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ShoppingBasket className="w-5 h-5" /> Monitoring Order
                    </button>
                    <button 
                        onClick={() => setActiveTab('announcements')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'announcements' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Megaphone className="w-5 h-5" /> Pengumuman
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 w-full rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" /> Keluar
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-gray-800 capitalize font-outfit">{activeTab.replace('-', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">Admin</p>
                            <p className="text-xs text-emerald-600 font-medium">{data.stats.serverStatus}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">A</div>
                    </div>
                </header>
                {renderContent()}
            </div>
        </div>
    );
}
