import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { Trash2, Plus, Minus, CreditCard, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';

export default function ShoppingCartUI() {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (!address || !phone) {
            alert('Silakan lengkapi alamat dan nomor telepon pengiriman');
            return;
        }
        setLoading(true);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        try {
            // For now, Midtrans only supports single product checkout
            // We'll create payment for the first item (or you can modify backend to support multiple)
            const totalAmount = cartTotal;
            const firstProduct = cart[0];

            const response = await fetch('/api/payment/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    product_id: firstProduct.id,
                    quantity: cart.reduce((sum, item) => sum + item.quantity, 0), // Total items
                    total_price: totalAmount,
                    cart_items: cart, // Send full cart for reference
                    shipping_address: address,
                    phone_number: phone
                })
            });

            const data = await response.json();

            if (data.success && data.snap_token) {
                // Open Midtrans Snap payment popup
                window.snap.pay(data.snap_token, {
                    onSuccess: function(result) {
                        console.log('Payment success:', result);
                        clearCart();
                        setSuccess(true);
                        setLoading(false);
                    },
                    onPending: function(result) {
                        console.log('Payment pending:', result);
                        alert('Menunggu pembayaran. Silakan selesaikan pembayaran Anda.');
                        setLoading(false);
                    },
                    onError: function(result) {
                        console.error('Payment error:', result);
                        alert('Pembayaran gagal. Silakan coba lagi.');
                        setLoading(false);
                    },
                    onClose: function() {
                        console.log('Payment popup closed');
                        setLoading(false);
                    }
                });
            } else {
                alert(data.message || 'Gagal membuat pembayaran');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error checkout:', error);
            alert('Terjadi kesalahan koneksi');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 font-outfit">Terima Kasih!</h2>
                <p className="text-gray-500 text-center max-w-xs mb-8">Pesananmu telah berhasil dibuat dan sedang menunggu konfirmasi dari petani.</p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700"
                >
                    Kembali Belanja
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
                <h3 className="text-xl font-bold text-gray-400">Keranjang Belanja Kosong</h3>
                <p className="text-gray-300">Ayo tambahkan produk segar dari petani!</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-outfit">Keranjang Belanja</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* List Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-6 bg-white p-6 rounded-3xl border border-gray-50 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img 
                                src={item.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=300&auto=format&fit=crop'} 
                                className="w-24 h-24 rounded-2xl object-cover" 
                                alt={item.name}
                            />
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{item.name}</h4>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.category?.name}</p>
                                    </div>
                                    <p className="font-black text-emerald-600 text-lg">Rp {Number(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-white rounded-lg transition-colors"><Minus className="w-4 h-4 text-emerald-600" /></button>
                                        <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white rounded-lg transition-colors"><Plus className="w-4 h-4 text-emerald-600" /></button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white p-8 rounded-3xl sticky top-24 shadow-2xl">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                             Ringkasan Pesanan
                        </h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Subtotal</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Biaya Layanan</span>
                                <span>Rp 0</span>
                            </div>
                            <div className="pt-4 border-t border-slate-800 flex justify-between">
                                <span className="font-bold">Total Pembayaran</span>
                                <span className="text-2xl font-black text-emerald-500">Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">Informasi Pengiriman</h4>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Alamat Lengkap</label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Masukkan alamat lengkap pengiriman..."
                                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 min-h-[100px] outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Nomor Telepon/WhatsApp</label>
                                <input 
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Contoh: 08123456789"
                                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Pilih Metode Pembayaran</>}
                        </button>
                        <p className="text-[10px] text-slate-500 text-center mt-6 uppercase font-bold tracking-widest">Aman & Terpercaya dengan AgriMatch</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
