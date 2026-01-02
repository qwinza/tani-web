import { useState, useEffect } from 'react';
import { Megaphone, Send, Users, User, UserCheck } from 'lucide-react';

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: '', target_role: 'all' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('/api/admin/announcements');
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setAnnouncements([data, ...announcements]);
                setFormData({ title: '', content: '', target_role: 'all' });
                alert('Pengumuman berhasil diposting!');
            }
        } catch (error) {
            console.error('Error posting announcement:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat pengumuman...</div>;

    return (
        <div className="p-8 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Broadcast Pengumuman</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-emerald-500" /> Posting Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target role</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    value={formData.target_role}
                                    onChange={(e) => setFormData({...formData, target_role: e.target.value})}
                                >
                                    <option value="all">Semua User</option>
                                    <option value="petani">Hanya Petani</option>
                                    <option value="pembeli">Hanya Pembeli</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Konten</label>
                                <textarea 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none h-32"
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" /> Kirim Sekarang
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-gray-900">Riwayat Pengumuman</h3>
                    {announcements.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                    item.target_role === 'all' ? 'bg-blue-100 text-blue-600' : 
                                    (item.target_role === 'petani' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600')
                                }`}>
                                    Target: {item.target_role}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
