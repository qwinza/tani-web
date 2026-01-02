import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

export default function AdminVerifyFarmers() {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setFarmers(data.filter(u => u.role === 'petani'));
            }
        } catch (error) {
            console.error('Error fetching farmers:', error);
        } finally {
            setLoading(false);
        }
    };

    const verify = async (user, status) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/api/admin/users/${user.id}/verify`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken 
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setFarmers(farmers.map(f => f.id === user.id ? { ...f, status } : f));
            }
        } catch (error) {
            console.error('Error verifying farmer:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat daftar verifikasi...</div>;

    const pendingFarmers = farmers.filter(f => f.status === 'pending');
    const processedFarmers = farmers.filter(f => f.status !== 'pending');

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Verifikasi Petani</h2>

            <div className="space-y-8">
                {/* Pending List */}
                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-amber-600 mb-4">
                        <Clock className="w-5 h-5" /> Menunggu Verifikasi ({pendingFarmers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingFarmers.length === 0 ? (
                            <p className="text-gray-500 italic">Tidak ada pengajuan baru.</p>
                        ) : (
                            pendingFarmers.map(farmer => (
                                <div key={farmer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                                            {farmer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{farmer.name}</p>
                                            <p className="text-xs text-gray-500">{farmer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                                        <MapPin className="w-3 h-3" /> Lokasi tidak ditentukan
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => verify(farmer, 'approved')}
                                            className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Setujui
                                        </button>
                                        <button 
                                            onClick={() => verify(farmer, 'rejected')}
                                            className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" /> Tolak
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* History List */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Keputusan</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal Daftar</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                                {processedFarmers.map(farmer => (
                                    <tr key={farmer.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{farmer.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                                                farmer.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {farmer.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(farmer.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => verify(farmer, 'pending')}
                                                className="text-xs text-emerald-600 hover:underline"
                                            >
                                                Ubah Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
