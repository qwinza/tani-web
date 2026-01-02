import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, MapPin } from 'lucide-react';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                setOrders(await response.json());
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'paid': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Memuat riwayat pesanan...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-outfit">Lacak Pesanan</h2>

            {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl border border-gray-50 shadow-sm text-center">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">Kamu belum pernah memesan apapun.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex flex-col md:flex-row gap-6 hover:border-emerald-200 transition-all group">
                            <img 
                                src={order.product?.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=300&auto=format&fit=crop'} 
                                alt={order.product?.name}
                                className="w-24 h-24 rounded-2xl object-cover"
                            />
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: #ORD-{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">{order.product?.name}</h4>
                                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                                            <MapPin className="w-3 h-3 text-emerald-500" />
                                            Penjual: {order.product?.user?.name || 'Petani AgriMatch'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400 font-medium">Total Harga</p>
                                        <p className="font-black text-gray-900 text-lg">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleString('id-ID')}
                                    </p>
                                    <button className="flex items-center gap-1 text-xs font-black text-emerald-600 hover:gap-2 transition-all">
                                        LIHAT DETAIL <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
