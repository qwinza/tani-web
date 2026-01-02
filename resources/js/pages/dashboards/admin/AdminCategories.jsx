import { useState, useEffect } from 'react';
import { Plus, Trash2, FolderEdit } from 'lucide-react';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ name: newName })
            });

            if (response.ok) {
                const data = await response.json();
                setCategories([...categories, data]);
                setNewName('');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm('Hapus kategori ini? Produk yang terhubung mungkin akan terpengaruh.')) return;

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });

            if (response.ok) {
                setCategories(categories.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat kategori...</div>;

    return (
        <div className="p-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Kategori Produk</h2>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={addCategory} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nama kategori baru (misal: Sayuran, Buah)"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Tambah
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(category => (
                    <div key={category.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-emerald-500 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                <FolderEdit className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{category.name}</p>
                                <p className="text-xs text-gray-400">slug: {category.slug}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => deleteCategory(category.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
