import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, XCircle, Clock, Truck, User, Phone, Eye, MapPin } from 'lucide-react';
import OrderDetailModal from '../../../components/OrderDetailModal';

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const approveOrder = async (orderId) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/orders/${orderId}/approve`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (response.ok) {
                const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'processing' } : o);
                setOrders(updatedOrders);
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: 'processing' });
                }
            }
        } catch (error) {
            console.error('Error approving order:', error);
        }
    };

    const shipOrder = async (orderId, file) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const formData = new FormData();
        formData.append('shipping_proof', file);

        try {
            const response = await fetch(`/api/orders/${orderId}/ship`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'shipped' } : o);
                setOrders(updatedOrders);
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: 'shipped' });
                }
            }
        } catch (error) {
            console.error('Error shipping order:', error);
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
                const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: status } : o);
                setOrders(updatedOrders);
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: status });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Memuat pesanan masuk...</div>;

    // Filter orders that are pending (regardless of payment status as requested)
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const processingOrders = orders.filter(o => o.status === 'processing');
    const historyOrders = orders.filter(o => !['pending', 'processing'].includes(o.status));

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-outfit">Pesanan Masuk</h2>

            <div className="space-y-12">
                {/* Pending Orders */}
                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-amber-600 mb-6 font-outfit">
                        <Clock className="w-5 h-5" /> Perlu Konfirmasi ({pendingOrders.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingOrders.length === 0 ? (
                            <div className="md:col-span-2 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center text-gray-400">
                                Belum ada pesanan berbayar yang masuk.
                            </div>
                        ) : (
                            pendingOrders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                                    <div className="flex gap-5 mb-6">
                                        <img 
                                            src={order.product?.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=200&auto=format&fit=crop'} 
                                            className="w-24 h-24 rounded-3xl object-cover shadow-sm"
                                            alt={order.product?.name}
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{order.product?.name}</h4>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                                                        order.payment_type ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                                                    }`}>
                                                        {order.payment_type ? 'Sudah Dibayar' : 'Menunggu Pembayaran'}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => handleViewDetail(order)}
                                                    className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <p className="text-sm font-bold text-gray-400 tracking-tighter">Qty: {order.quantity}</p>
                                                <p className="text-xl font-black text-slate-900">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-5 rounded-[2rem] mb-6 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-sm font-black text-emerald-600 shadow-sm border border-gray-100">
                                                {order.buyer?.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black text-gray-900 leading-none">{order.buyer?.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{order.phone_number || order.buyer?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-[11px] font-bold text-gray-500 line-clamp-2">
                                            <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
                                            {order.shipping_address || 'Alamat tidak tersedia'}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => approveOrder(order.id)}
                                            className="flex-1 py-4 bg-emerald-600 text-white rounded-3xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Terima Pesanan
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(order.id, 'cancelled')}
                                            className="px-5 py-4 bg-red-50 text-red-600 rounded-3xl font-black text-sm hover:bg-red-100 transition-all"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Processing Orders */}
                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-blue-600 mb-6 font-outfit">
                        <ShoppingBag className="w-5 h-5" /> Siap Dikirim ({processingOrders.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {processingOrders.length === 0 ? (
                            <div className="md:col-span-2 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center text-gray-400">
                                Belum ada pesanan yang siap dikirim.
                            </div>
                        ) : (
                            processingOrders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                                    <div className="flex gap-5 mb-6">
                                        <img 
                                            src={order.product?.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=200&auto=format&fit=crop'} 
                                            className="w-24 h-24 rounded-3xl object-cover shadow-sm"
                                            alt={order.product?.name}
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{order.product?.name}</h4>
                                                <button 
                                                    onClick={() => handleViewDetail(order)}
                                                    className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <p className="text-sm font-bold text-gray-400 tracking-tighter">Qty: {order.quantity}</p>
                                                <p className="text-xl font-black text-slate-900">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-5 rounded-[2rem] mb-6 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-sm font-black text-blue-600 shadow-sm border border-gray-100">
                                                {order.buyer?.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black text-gray-900 leading-none">{order.buyer?.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{order.phone_number || order.buyer?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-[11px] font-bold text-gray-500 line-clamp-2">
                                            <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
                                            {order.shipping_address || 'Alamat tidak tersedia'}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-2">Unggah Bukti Pengiriman</p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="file" 
                                                id={`ship-${order.id}`}
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        shipOrder(order.id, e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <label 
                                                htmlFor={`ship-${order.id}`}
                                                className="flex-1 py-4 bg-blue-600 text-white rounded-3xl font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-100"
                                            >
                                                <Truck className="w-5 h-5" /> Kirim Pesanan
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Order History */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 font-outfit">Riwayat Penjualan</h3>
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-clip">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Produk</th>
                                    <th className="px-8 py-5">Pembeli</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                                {historyOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{order.product?.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400">#ORD-{order.id}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-gray-700">{order.buyer?.name}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                                                order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                order.status === 'processing' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                (order.status === 'pending' && order.payment_type === null) ? 'bg-gray-50 text-gray-400 border-gray-100' :
                                                'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {order.status === 'processing' ? 'Disiapkan' : 
                                                 order.status === 'shipped' ? 'Dikirim' :
                                                 (order.status === 'pending' && order.payment_type === null) ? 'Belum Bayar' :
                                                 order.status === 'completed' ? 'Selesai' :
                                                 order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => handleViewDetail(order)}
                                                className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-gray-100"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <OrderDetailModal 
                isOpen={isModalOpen}
                order={selectedOrder}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
