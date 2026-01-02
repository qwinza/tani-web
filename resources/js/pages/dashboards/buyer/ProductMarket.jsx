import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Tag, LayoutGrid, List, ShoppingBasket } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export default function ProductMarket() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);
            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="p-12 text-center text-emerald-600 font-bold animate-pulse">Memuat Produk Terbaik Untukmu...</div>;

    return (
        <div className="p-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Cari produk pertanian segar..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        className="px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-gray-700"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <ShoppingBasket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">Wah, produk yang kamu cari tidak ditemukan.</p>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <img 
                                    src={product.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=300&auto=format&fit=crop'} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">
                                    {product.category?.name || 'Lainnya'}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-1">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">Harga per sat</p>
                                        <p className="text-xl font-black text-emerald-600">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-90 transition-all"
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                    <Tag className="w-3 h-3" />
                                    Stok: <span className={product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}>{product.stock} tersedia</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
