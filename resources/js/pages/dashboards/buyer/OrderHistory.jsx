import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, MapPin, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import OrderDetailModal from '../../../components/OrderDetailModal';
import RatingModal from '../../../components/RatingModal';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ratingOrder, setRatingOrder] = useState(null);
    const [isRatingOpen, setIsRatingOpen] = useState(false);

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

    const completeOrder = async (orderId, ratingData) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/orders/${orderId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(ratingData)
            });

            if (response.ok) {
                const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'completed' } : o);
                setOrders(updatedOrders);
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: 'completed' });
                }
            }
        } catch (error) {
            console.error('Error completing order:', error);
        }
    };

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const getStatusStyle = (order) => {
        const { status, payment_type } = order;
        switch (status) {
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': 
                return payment_type === null 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'shipped': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const getStatusIcon = (order) => {
        const { status, payment_type } = order;
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return payment_type === null ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
            case 'processing': return <Package className="w-4 h-4" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const getStatusLabel = (order) => {
        const { status, payment_type } = order;
        switch (status) {
            case 'pending': 
                return payment_type === null 
                    ? 'Menunggu Pembayaran' 
                    : 'Dibayar (Menunggu Konfirmasi Petani)';
            case 'processing': return 'Pesanan Sedang Disiapkan';
            case 'shipped': return 'Pesanan Dalam Perjalanan';
            case 'completed': return 'Pesanan Selesai';
            case 'cancelled': return 'Pesanan Dibatalkan';
            default: return status;
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Memuat riwayat pesanan...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-gray-900 mb-2 font-outfit">Lacak Pesanan</h2>
            <p className="text-gray-400 font-bold mb-10 tracking-tight">Pantau proses pengiriman produk segar pilihanmu</p>

            {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-black text-xl mb-2">Riwayat Kosong</p>
                    <p className="text-gray-300 font-bold text-sm">Kamu belum pernah memesan produk apapun.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:border-emerald-100 hover:scale-[1.01] transition-all duration-300 group">
                            <div className="relative">
                                <img 
                                    src={order.product?.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=300&auto=format&fit=crop'} 
                                    alt={order.product?.name}
                                    className="w-32 h-32 rounded-[2rem] object-cover shadow-lg border-2 border-white group-hover:rotate-2 transition-transform"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                                    <ShoppingBag className="w-4 h-4" />
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full tracking-widest uppercase">#ORD-{order.id}</span>
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 shadow-sm ${getStatusStyle(order)}`}>
                                                {getStatusIcon(order)} {getStatusLabel(order)}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-gray-900 text-2xl mb-1 font-outfit leading-tight">{order.product?.name}</h4>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            <span>Penjual: {order.product?.user?.name || 'Petani AgriMatch'}</span>
                                        </div>
                                    </div>
                                    <div className="lg:text-right">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Transaksi</p>
                                        <p className="font-black text-gray-900 text-3xl tracking-tighter">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex items-center gap-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                        <p>{order.quantity} Satuan</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        {order.status === 'shipped' && (
                                            <button 
                                                onClick={() => {
                                                    setRatingOrder(order);
                                                    setIsRatingOpen(true);
                                                }}
                                                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95"
                                            >
                                                Selesaikan Pesanan
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleViewDetail(order)}
                                            className="px-6 py-3 bg-gray-50 text-gray-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                        >
                                            Detail <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <OrderDetailModal 
                isOpen={isModalOpen}
                order={selectedOrder}
                onClose={() => setIsModalOpen(false)}
            />

            <RatingModal 
                isOpen={isRatingOpen}
                order={ratingOrder}
                onClose={() => setIsRatingOpen(false)}
                onSubmit={completeOrder}
            />
        </div>
    );
}
