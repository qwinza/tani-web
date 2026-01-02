import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit3, Trash2, X, AlertCircle, Save, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
        image: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/my-products'),
                fetch('/api/categories')
            ]);
            
            if (productsRes.ok && categoriesRes.ok) {
                setProducts(await productsRes.json());
                setCategories(await categoriesRes.json());
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category_id: product.category_id || '',
                price: product.price,
                stock: product.stock,
                description: product.description || '',
                image: null
            });
            setPreviewUrl(product.image_url);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category_id: '',
                price: '',
                stock: '',
                description: '',
                image: null
            });
            setPreviewUrl(null);
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }

        let url = '/api/products';
        if (editingProduct) {
            url = `/api/products/${editingProduct.id}`;
            // Laravel requires POST with _method=PUT for multipart/form-data
            data.append('_method', 'PUT');
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: data
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Gagal menyimpan produk');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if (loading && products.length === 0) return <div className="p-12 text-center text-gray-400">Memuat produk...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 font-outfit">Katalog Produk</h2>
                    <p className="text-slate-400 text-sm">Kelola semua produk pertanian Anda di sini.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-amber-500/20 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Tambah Produk Baru
                </button>
            </div>

            {products.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400 mb-2">Belum ada produk</h3>
                    <p className="text-slate-300 max-w-xs mx-auto mb-8">Mulailah dengan menambahkan produk pertama Anda untuk dijual di pasar digital.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all p-4 group flex flex-col">
                            <div className="aspect-square bg-slate-50 rounded-[32px] mb-6 overflow-hidden relative">
                                <img 
                                    src={product.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=400&auto=format&fit=crop'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={product.name}
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-amber-600 uppercase tracking-widest shadow-sm">
                                    {categories.find(c => c.id === product.category_id)?.name || 'Umum'}
                                </div>
                                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button 
                                        onClick={() => handleOpenModal(product)}
                                        className="p-3 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-2xl shadow-lg transition-colors"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="p-3 bg-white hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-2xl shadow-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="px-2 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                                <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2">{product.description}</p>
                                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Stok: <span className={product.stock < 5 ? 'text-red-500' : 'text-emerald-600'}>{product.stock} unit</span></p>
                                        <p className="text-xl font-black text-emerald-600">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock > 0 ? 'Sedia' : 'Habis'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-xl relative overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <header className="p-8 pb-0 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 font-outfit">{editingProduct ? 'Ubah Produk' : 'Tambah Produk'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Nama Produk</label>
                                    <input 
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                                        placeholder="Misal: Tomat Cherry Organik"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Kategori</label>
                                    <select 
                                        required
                                        value={formData.category_id}
                                        onChange={e => setFormData({...formData, category_id: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 transition-all appearance-none"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Harga (Rp)</label>
                                    <input 
                                        type="number" required min="0"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Stok Awal</label>
                                    <input 
                                        type="number" required min="0"
                                        value={formData.stock}
                                        onChange={e => setFormData({...formData, stock: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Deskripsi Produk</label>
                                <textarea 
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 placeholder:text-slate-300 transition-all resize-none"
                                    placeholder="Ceritakan keunggulan produk Anda..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Foto Produk
                                </label>
                                
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Preview */}
                                    <div className="w-32 h-32 bg-slate-100 rounded-[32px] overflow-hidden border-2 border-dashed border-slate-200 flex-shrink-0 relative group">
                                        {previewUrl ? (
                                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-slate-300" />
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <span className="text-[10px] text-white font-black uppercase">Ganti</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>

                                    {/* File Input Description */}
                                    <div className="flex-1 space-y-3">
                                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <p className="text-[10px] font-bold text-emerald-700 uppercase leading-relaxed">Tip Foto Terbaik:</p>
                                            <p className="text-[10px] text-emerald-600 font-medium leading-relaxed">Gunakan pencahayaan terang dan latar belakang bersih agar pembeli tertarik.</p>
                                        </div>
                                        <label className="block w-full cursor-pointer">
                                            <span className="inline-block px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all">Pilih File Foto</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-[32px] shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Save className="w-6 h-6" /> {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
