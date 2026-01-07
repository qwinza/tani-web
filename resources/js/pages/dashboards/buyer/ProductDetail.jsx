import { useState, useEffect } from 'react';
import {
    ShoppingCart,
    ArrowLeft,
    Star,
    MapPin,
    Phone,
    Mail,
    Tag,
    Package,
    Shield,
    Leaf,
    Heart,
    Share2,
    Minus,
    Plus
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export default function ProductDetail({ productId, onBack }) {
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, quantity });
        }
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product?.stock) {
            setQuantity(newQuantity);
        }
    };

    // Product images - use uploaded image first, then images array, then fallback to single dummy image
    const productImages = (() => {
        // If images array exists and has items, use it
        if (product?.images && product.images.length > 0) {
            return product.images;
        }
        // Otherwise use image_url if available
        if (product?.image_url) {
            return [product.image_url];
        }
        // Last resort: single dummy image
        return ['https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=800&auto=format&fit=crop'];
    })();

    // Product features - use from database if available
    const productFeatures = product?.features || [
        'Segar dari kebun',
        'Tanpa pestisida kimia',
        'Dipanen hari ini'
    ];

    // Certifications
    const certifications = product?.certifications || ['Organik'];

    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="inline-block w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-emerald-600 font-bold">Memuat detail produk...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-12 text-center">
                <p className="text-gray-600">Produk tidak ditemukan</p>
                <button
                    onClick={onBack}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Pasar
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column - Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-lg relative group">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Badges */}
                            <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                                <span className="px-4 py-2 bg-white/95 backdrop-blur rounded-full text-sm font-bold text-emerald-600 shadow-lg">
                                    {product.category?.name || 'Kategori'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`w-12 h-12 rounded-full backdrop-blur flex items-center justify-center transition-all shadow-lg ${isFavorite
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/95 text-gray-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="w-12 h-12 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-lg">
                                        <Share2 className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-2xl overflow-hidden transition-all ${selectedImage === index
                                        ? 'ring-4 ring-emerald-600 scale-95'
                                        : 'hover:scale-95 opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        {/* Product Title & Rating */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">5.0 (127 ulasan)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                            <p className="text-sm text-gray-600 mb-1">Harga per {product.unit || 'satuan'}</p>
                            <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-black text-emerald-600">
                                    Rp {Number(product.price).toLocaleString('id-ID')}
                                </p>
                                <span className="text-lg text-gray-500">/ {product.unit || 'kg'}</span>
                            </div>
                            {product.origin && (
                                <p className="text-sm text-gray-600 mt-3">📍 Dari {product.origin}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Produk</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description || 'Produk berkualitas tinggi langsung dari petani lokal. Segar, organik, dan penuh nutrisi untuk keluarga Anda.'}
                            </p>
                            {product.harvest_date && (
                                <p className="text-sm text-emerald-600 font-semibold mt-3">🌾 Dipanen: {new Date(product.harvest_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            )}
                        </div>

                        {/* Product Features List */}
                        {productFeatures.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Keunggulan Produk</h3>
                                <ul className="space-y-2">
                                    {productFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-600">
                                            <span className="text-emerald-600 mt-1">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Certifications */}
                        {certifications.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Sertifikasi</h3>
                                <div className="flex flex-wrap gap-2">
                                    {certifications.map((cert, index) => (
                                        <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                            🏆 {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Features */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">100%</p>
                                    <p className="font-bold text-sm text-gray-900">Organik</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Terjamin</p>
                                    <p className="font-bold text-sm text-gray-900">Kualitas</p>
                                </div>
                            </div>
                        </div>

                        {/* Stock & Quantity */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Stok tersedia:</span>
                                    <span className={`font-bold text-sm ${product.stock > 10 ? 'text-emerald-600' : 'text-orange-600'}`}>
                                        {product.stock} unit
                                    </span>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Jumlah</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-1">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 bg-gray-100 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                if (val >= 1 && val <= product.stock) {
                                                    setQuantity(val);
                                                }
                                            }}
                                            className="w-16 text-center font-bold text-lg outline-none"
                                            min="1"
                                            max={product.stock}
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.stock}
                                            className="w-10 h-10 bg-gray-100 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="text-2xl font-black text-gray-900">
                                            Rp {(Number(product.price) * quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                        </button>

                        {/* Seller Info */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-emerald-600" />
                                Informasi Penjual
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {product.user?.name?.charAt(0).toUpperCase() || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{product.user?.name || 'Petani Lokal'}</p>
                                        <p className="text-sm text-gray-500">Petani Terdaftar</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        <span>{product.user?.location || 'Jawa Barat, Indonesia'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-emerald-600" />
                                        <span>{product.user?.phone || '+62 812-3456-7890'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4 text-emerald-600" />
                                        <span>{product.user?.email || 'petani@agrimatch.com'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Pengiriman Cepat</h4>
                        <p className="text-sm text-gray-600">Produk dikirim dalam 1-2 hari kerja</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-7 h-7 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Jaminan Kualitas</h4>
                        <p className="text-sm text-gray-600">100% fresh atau uang kembali</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Leaf className="w-7 h-7 text-green-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">100% Organik</h4>
                        <p className="text-sm text-gray-600">Tanpa pestisida berbahaya</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
