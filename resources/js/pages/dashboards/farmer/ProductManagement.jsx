import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Check } from 'lucide-react';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Image preview states
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([null, null, null]);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        unit: 'kg',
        stock: '',
        min_order: '1',
        origin: '',
        harvest_date: '',
        features: ['', '', ''],
        certifications: [],
        mainImage: null,
        additionalImages: []
    });

    const [availableCertifications] = useState([
        'Organik', 'Halal', 'Non-GMO', 'Fair Trade', 'Lokal'
    ]);

    const units = ['kg', 'liter', 'pack', 'piece', 'ikat', 'ons'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/my-products'),
                fetch('/api/categories')
            ]);
            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category_id: '',
            description: '',
            price: '',
            unit: 'kg',
            stock: '',
            min_order: '1',
            origin: '',
            harvest_date: '',
            features: ['', '', ''],
            certifications: [],
            mainImage: null,
            additionalImages: []
        });
        setEditingProduct(null);
        setIsFormOpen(false);

        // Clean up preview URLs
        if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
        setMainImagePreview(null);
        additionalImagePreviews.forEach(preview => {
            if (preview) URL.revokeObjectURL(preview);
        });
        setAdditionalImagePreviews([null, null, null]);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        // Parse JSON fields if they are strings
        const parseJsonField = (field) => {
            if (typeof field === 'string') {
                try {
                    const parsed = JSON.parse(field);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            }
            return Array.isArray(field) ? field : [];
        };

        const parsedFeatures = parseJsonField(product.features);
        const parsedCertifications = parseJsonField(product.certifications);

        setFormData({
            name: product.name,
            category_id: product.category_id,
            description: product.description || '',
            price: product.price,
            unit: product.unit || 'kg',
            stock: product.stock,
            min_order: product.min_order || '1',
            origin: product.origin || '',
            harvest_date: product.harvest_date ? product.harvest_date.split('T')[0] : '',
            features: parsedFeatures && parsedFeatures.length > 0 ? parsedFeatures : ['', '', ''],
            certifications: parsedCertifications || [],
            mainImage: null,
            additionalImages: []
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('unit', formData.unit);
        data.append('stock', formData.stock);
        data.append('min_order', formData.min_order);

        if (formData.origin) data.append('origin', formData.origin);
        if (formData.harvest_date) data.append('harvest_date', formData.harvest_date);

        // Filter empty features
        const validFeatures = formData.features.filter(f => f.trim() !== '');
        if (validFeatures.length > 0) {
            data.append('features', JSON.stringify(validFeatures));
        }

        if (formData.certifications.length > 0) {
            data.append('certifications', JSON.stringify(formData.certifications));
        }

        if (formData.mainImage) {
            data.append('image', formData.mainImage);
        }

        // Send additional images as separate files
        if (formData.additionalImages.length > 0) {
            formData.additionalImages.forEach((file, index) => {
                if (file) {
                    data.append('additionalImages[]', file);
                }
            });
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    ...(method === 'PUT' && { 'Content-Type': 'application/json' })
                },
                body: method === 'POST' ? data : JSON.stringify({
                    name: formData.name,
                    category_id: formData.category_id,
                    description: formData.description,
                    price: formData.price,
                    unit: formData.unit,
                    stock: formData.stock,
                    min_order: formData.min_order,
                    origin: formData.origin,
                    harvest_date: formData.harvest_date,
                    features: validFeatures,
                    certifications: formData.certifications
                })
            });

            if (response.ok) {
                fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus produk ini?')) return;

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            fetchData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleCertification = (cert) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    const updateFeature = (index, value) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? value : f)
        }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    // Create preview URL when main image is selected
    useEffect(() => {
        if (formData.mainImage) {
            // Clean up old preview URL
            if (mainImagePreview) {
                URL.revokeObjectURL(mainImagePreview);
            }
            // Create new preview URL
            const previewUrl = URL.createObjectURL(formData.mainImage);
            setMainImagePreview(previewUrl);
        } else {
            // If editing existing product, show existing image
            if (editingProduct?.image_url) {
                setMainImagePreview(editingProduct.image_url);
            } else {
                setMainImagePreview(null);
            }
        }

        // Cleanup on unmount
        return () => {
            if (mainImagePreview && formData.mainImage) {
                URL.revokeObjectURL(mainImagePreview);
            }
        };
    }, [formData.mainImage, editingProduct]);

    // Create preview URLs for additional images
    useEffect(() => {
        const newPreviews = formData.additionalImages.map((file, index) => {
            if (file) {
                // Clean up old preview
                if (additionalImagePreviews[index]) {
                    URL.revokeObjectURL(additionalImagePreviews[index]);
                }
                return URL.createObjectURL(file);
            }
            return null;
        });

        setAdditionalImagePreviews(newPreviews);

        // Cleanup on unmount
        return () => {
            newPreviews.forEach(preview => {
                if (preview) URL.revokeObjectURL(preview);
            });
        };
    }, [formData.additionalImages]);

    if (loading) return <div className="p-12 text-center text-emerald-600 font-bold animate-pulse">Memuat produk...</div>;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Kelola Produk Saya</h2>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus produk yang Anda jual</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Produk
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-gray-100 relative">
                            <img
                                src={product.image_url || 'https://images.unsplash.com/photo-1595841696662-540937a6b28b?q=80&w=400'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-emerald-600">
                                {product.category?.name}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-emerald-600 font-black text-xl mb-3">
                                Rp {Number(product.price).toLocaleString('id-ID')} <span className="text-sm text-gray-500">/ {product.unit || 'kg'}</span>
                            </p>
                            <p className="text-sm text-gray-500 mb-4">Stok: {product.stock} unit</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-gray-900">
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h3>
                            <button
                                onClick={resetForm}
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-lg">Informasi Dasar</h4>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Produk *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        placeholder="Contoh: Tomat Segar Organik"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                                        <select
                                            required
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        >
                                            <option value="">Pilih kategori</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Asal/Lokasi</label>
                                        <input
                                            type="text"
                                            value={formData.origin}
                                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                            placeholder="Contoh: Bandung, Jawa Barat"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi *</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                        placeholder="Deskripsikan produk Anda secara detail..."
                                    />
                                </div>
                            </div>

                            {/* Pricing & Stock */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-lg">Harga & Stok</h4>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Harga *</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                            placeholder="20000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Satuan *</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        >
                                            {units.map(unit => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stok *</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimal Pemesanan</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.min_order}
                                            onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                            placeholder="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Panen</label>
                                        <input
                                            type="date"
                                            value={formData.harvest_date}
                                            onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Product Features */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-900 text-lg">Keunggulan Produk</h4>
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
                                    >
                                        + Tambah Keunggulan
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500">Jelaskan apa yang membuat produk Anda istimewa</p>

                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                            placeholder={`Keunggulan ${index + 1}: Contoh - Segar dari kebun`}
                                        />
                                        {formData.features.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="w-12 h-12 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                                            >
                                                <X className="w-5 h-5 mx-auto" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Certifications */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-lg">Sertifikasi</h4>
                                <p className="text-sm text-gray-500">Pilih sertifikasi yang dimiliki produk Anda</p>

                                <div className="flex flex-wrap gap-3">
                                    {availableCertifications.map(cert => (
                                        <button
                                            key={cert}
                                            type="button"
                                            onClick={() => toggleCertification(cert)}
                                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${formData.certifications.includes(cert)
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {formData.certifications.includes(cert) && <Check className="w-4 h-4 inline mr-1" />}
                                            {cert}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-lg">Foto Produk *</h4>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Utama</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, mainImage: e.target.files[0] })}
                                            className="hidden"
                                            id="mainImage"
                                        />
                                        <label htmlFor="mainImage" className="cursor-pointer block">
                                            {mainImagePreview ? (
                                                <div className="space-y-3">
                                                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                                        <img
                                                            src={mainImagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-emerald-600 font-semibold text-center">
                                                        ✓ {formData.mainImage ? formData.mainImage.name : 'Foto saat ini'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 text-center">Klik untuk mengganti</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-sm text-gray-600 font-semibold">
                                                        Klik untuk upload foto utama
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG hingga 2MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Tambahan (Opsional)</label>
                                    <p className="text-xs text-gray-500 mb-2">Upload hingga 3 foto tambahan untuk galeri produk</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[0, 1, 2].map(index => (
                                            <div key={index} className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-emerald-500 transition-colors aspect-square">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const newImages = [...formData.additionalImages];
                                                        newImages[index] = e.target.files[0];
                                                        setFormData({ ...formData, additionalImages: newImages });
                                                    }}
                                                    className="hidden"
                                                    id={`additionalImage${index}`}
                                                />
                                                <label htmlFor={`additionalImage${index}`} className="cursor-pointer w-full h-full flex items-center justify-center">
                                                    {additionalImagePreviews[index] ? (
                                                        <img
                                                            src={additionalImagePreviews[index]}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                                            <p className="text-xs text-gray-600">+</p>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                >
                                    {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
