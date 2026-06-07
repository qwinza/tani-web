import React from 'react';
import { X, Package, Clock, Truck, CheckCircle, MapPin, Phone, Mail, ExternalLink, CreditCard, ShoppingCart } from 'lucide-react';

export default function OrderDetailModal({ order, isOpen, onClose }) {
    if (!isOpen || !order) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending': return { label: 'Menunggu Konfirmasi', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock className="w-5 h-5" /> };
            case 'processing': return { label: 'Sedang Disiapkan', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package className="w-5 h-5" /> };
            case 'shipped': return { label: 'Dalam Perjalanan', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Truck className="w-5 h-5" /> };
            case 'completed': return { label: 'Selesai', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <CheckCircle className="w-5 h-5" /> };
            case 'cancelled': return { label: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-50', icon: <X className="w-5 h-5" /> };
            default: return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', icon: <Package className="w-5 h-5" /> };
        }
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="relative p-10 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <button 
                        onClick={onClose}
                        className="absolute right-8 top-8 p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-all border border-gray-100 active:scale-95"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-[1.5rem] shadow-sm ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-3xl font-black text-gray-900 font-outfit">Detail Pesanan</h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusInfo.bg} ${statusInfo.color} border-current opacity-70`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 font-mono">ID: #ORD-{order.id} • {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                    {/* Status Banner */}
                    <div className={`p-6 rounded-[2rem] ${statusInfo.bg} flex items-center justify-between border border-current border-opacity-10`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full animate-pulse bg-current`}></div>
                            <span className={`font-black text-sm uppercase tracking-widest ${statusInfo.color}`}>{statusInfo.label}</span>
                        </div>
                        {order.payment_type && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl shadow-sm">
                                <CreditCard className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider">
                                    Dibayar via {order.payment_type.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* LEFT: Product & Summary */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                                    <ShoppingCart className="w-3 h-3" /> Informasi Produk
                                </h4>
                                <div className="flex gap-5 p-4 bg-gray-50/50 rounded-[2rem] border border-gray-50">
                                    <img 
                                        src={order.product?.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=200&auto=format&fit=crop'} 
                                        className="w-24 h-24 rounded-[1.5rem] object-cover shadow-md border-2 border-white"
                                        alt={order.product?.name}
                                    />
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="font-black text-gray-900 leading-tight mb-1 text-lg">{order.product?.name}</p>
                                        <p className="text-xs font-bold text-gray-400 mb-2">{order.quantity} unit x Rp {Number(order.total_price / order.quantity).toLocaleString('id-ID')}</p>
                                        <div className="pt-2 border-t border-gray-100 justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Subtotal</span>
                                            <p className="text-xl font-black text-emerald-600 tracking-tighter">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                    <MapPin className="w-3 h-3" /> Alamat Pengiriman
                                </h4>
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <MapPin className="w-12 h-12" />
                                    </div>
                                    <p className="text-sm font-black text-gray-900 mb-2">{order.buyer?.name}</p>
                                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                        {order.shipping_address || order.buyer?.address || 'Alamat belum diatur'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Contact & Shipping Proof */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                    <Phone className="w-3 h-3" /> Kontak Penerima
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-100 transition-colors">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-black text-gray-700">{order.buyer?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-100 transition-colors">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Telepon / WA</p>
                                            <p className="text-sm font-black text-gray-700">{order.phone_number || order.buyer?.phone || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {order.shipping_proof && (
                                <div className="animate-in slide-in-from-bottom-5 duration-500">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                        <Truck className="w-3 h-3" /> Bukti Pengiriman
                                    </h4>
                                    <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border-4 border-white shadow-xl">
                                        <img 
                                            src={order.shipping_proof.startsWith('http') ? order.shipping_proof : `/storage/${order.shipping_proof}`} 
                                            className="w-full h-44 object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            alt="Bukti Kirim"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                            <a 
                                                href={order.shipping_proof.startsWith('http') ? order.shipping_proof : `/storage/${order.shipping_proof}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="bg-white px-6 py-2 rounded-full shadow-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-gray-900 hover:bg-emerald-600 hover:text-white transition-all"
                                            >
                                                <ExternalLink className="w-4 h-4" /> Lihat Fullscreen
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em]">AgriMatch • Jembatan Petani & Konsumen</p>
                </div>
            </div>
        </div>
    );
}
