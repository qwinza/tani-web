import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Trash2, Search } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (user) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/admin/users/${user.id}/toggle`, {
                method: 'PATCH',
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (response.ok) {
                setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Memuat data user...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Cari user (nama/email)..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Informasi User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status Akun</th>
                            <th className="px-6 py-4">Terdaftar</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        user.role === 'petani' ? 'bg-orange-100 text-orange-600' : 
                                        (user.role === 'superadmin' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600')
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {user.is_active ? 'Aktif' : 'Diblokir'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onClick={() => toggleStatus(user)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            user.is_active ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'
                                        }`}
                                        title={user.is_active ? 'Blokir User' : 'Buka Blokir'}
                                    >
                                        {user.is_active ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
