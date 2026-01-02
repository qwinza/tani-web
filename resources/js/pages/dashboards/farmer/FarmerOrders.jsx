import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, XCircle, Clock, Truck, User, Phone } from 'lucide-react';

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/farmer/orders');
            if (response.ok) {
                setOrders(await response.json());
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, status) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Memuat pesanan masuk...</div>;

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const historyOrders = orders.filter(o => o.status !== 'pending');

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-outfit">Pesanan Masuk</h2>

            <div className="space-y-12">
                {/* Pending Orders */}
                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-amber-600 mb-6">
                        <Clock className="w-5 h-5" /> Perlu Diproses ({pendingOrders.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingOrders.length === 0 ? (
                            <p className="text-gray-400 italic">Belum ada pesanan baru hari ini.</p>
                        ) : (
                            pendingOrders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden">
                                    <div className="flex gap-4 mb-6">
                                        <img 
                                            src={order.product?.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=200&auto=format&fit=crop'} 
                                            className="w-20 h-20 rounded-2xl object-cover"
                                            alt={order.product?.name}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 leading-tight">{order.product?.name}</h4>
                                            <p className="text-sm text-gray-400">Jumlah: <span className="text-emerald-600 font-bold">{order.quantity} unit</span></p>
                                            <p className="text-lg font-black text-slate-900">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                {order.buyer?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{order.buyer?.name}</p>
                                                <p className="text-[10px] text-gray-400">{order.buyer?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateStatus(order.id, 'paid')}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Terima Pesanan
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(order.id, 'cancelled')}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Order History */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Riwayat Penjualan</h3>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Produk</th>
                                    <th className="px-6 py-4">Pembeli</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                                {historyOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{order.product?.name}</p>
                                            <p className="text-[10px] text-gray-400">#ORD-{order.id}</p>
                                        </td>
                                        <td className="px-6 py-4">{order.buyer?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                                order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                                (order.status === 'paid' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600')
                                            }`}>
                                                {order.status === 'paid' ? 'Diproses' : order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {order.status === 'paid' && (
                                                <button 
                                                    onClick={() => updateStatus(order.id, 'completed')}
                                                    className="text-emerald-600 font-bold text-xs hover:underline"
                                                >
                                                    Selesaikan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
