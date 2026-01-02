import { useState, useEffect } from 'react';
import { ShoppingBasket, Receipt, Calendar, CreditCard } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat riwayat transaksi...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 font-outfit">Monitoring Transaksi</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">ID Pesanan</th>
                            <th className="px-6 py-4">Produk</th>
                            <th className="px-6 py-4">Pembeli</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">
                                    Belum ada transaksi yang terjadi dalam sistem.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-emerald-600 font-bold">#ORD-{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.product?.name || 'Produk dihapus'}</td>
                                    <td className="px-6 py-4">{order.buyer?.name || 'User dihapus'}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                            (order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600')
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {new Date(order.created_at).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
