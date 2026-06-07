import { useState, useEffect } from 'react';
import { 
    Shield, 
    AlertTriangle, 
    UserX, 
    Globe, 
    Search, 
    Terminal, 
    Play, 
    CheckCircle,
    Info,
    RefreshCw
} from 'lucide-react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid, 
    Legend 
} from 'recharts';

export default function SecurityMonitoring() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');
    
    // Simulation Form State
    const [simulation, setSimulation] = useState({
        type: 'sql_injection',
        severity: 'high',
        details: 'Percobaan injeksi SQL pada parameter pencarian produk.'
    });
    const [simulating, setSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);

    const SEVERITY_COLORS = {
        low: '#3b82f6',     // Blue
        medium: '#f59e0b',  // Amber
        high: '#ef4444',    // Red
        critical: '#991b1b' // Dark Red
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/security-alerts', {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error('Error fetching security alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSimulate = async (e) => {
        e.preventDefault();
        setSimulating(true);
        setSimulationResult(null);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/api/admin/security-alerts/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(simulation)
            });

            const data = await response.json();
            if (response.ok) {
                setSimulationResult({
                    success: true,
                    message: data.message
                });
                fetchAlerts();
            } else {
                setSimulationResult({
                    success: false,
                    message: data.message || 'Gagal mengirim simulasi.'
                });
            }
        } catch (error) {
            setSimulationResult({
                success: false,
                message: 'Error menghubungkan ke server.'
            });
        } finally {
            setSimulating(false);
        }
    };

    // Calculate Dashboard Statistics
    const totalAlerts = alerts.length;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;
    const uniqueIps = new Set(alerts.map(a => a.ip_address)).size;
    const wafStatus = "Active (ModSecurity + App WAF)";

    // Chart Data Preparation: Severity Distribution
    const severityCount = alerts.reduce((acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
    }, {});
    
    const severityChartData = Object.keys(severityCount).map(key => ({
        name: key.toUpperCase(),
        value: severityCount[key]
    }));

    // Chart Data Preparation: Attack Types Distribution
    const typeCount = alerts.reduce((acc, alert) => {
        const readableType = alert.event_type.replace('_', ' ').toUpperCase();
        acc[readableType] = (acc[readableType] || 0) + 1;
        return acc;
    }, {});

    const typeChartData = Object.keys(typeCount).map(key => ({
        name: key,
        Jumlah: typeCount[key]
    })).slice(0, 5); // top 5

    // Filtering logic
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = 
            alert.ip_address.includes(searchTerm) || 
            alert.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
            alert.event_type.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || alert.event_type === filterType;
        const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;

        return matchesSearch && matchesType && matchesSeverity;
    });

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case 'critical':
                return <span className="px-2.5 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-md uppercase">CRITICAL</span>;
            case 'high':
                return <span className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-md uppercase">HIGH</span>;
            case 'medium':
                return <span className="px-2.5 py-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded-md uppercase">MEDIUM</span>;
            default:
                return <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md uppercase">LOW</span>;
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'sql_injection':
                return <Terminal className="w-4 h-4 text-red-600" />;
            case 'xss_attempt':
                return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            case 'login_failed':
                return <UserX className="w-4 h-4 text-yellow-600" />;
            default:
                return <Shield className="w-4 h-4 text-blue-600" />;
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Monitoring Keamanan & IDS
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Log deteksi aktivitas mencurigakan, WAF aplikasi, dan audit log jaringan.
                    </p>
                </div>
                <button 
                    onClick={fetchAlerts}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl transition-all text-xs font-semibold shadow-sm active:scale-95"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Log
                </button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-red-400 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Insiden</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-600">{totalAlerts}</span>
                        <span className="text-xs text-gray-500">terdeteksi</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-400 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tingkat Bahaya Tinggi</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-600">{criticalAlerts}</span>
                        <span className="text-xs text-gray-500">kejadian</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">IP Penyerang Unik</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">{uniqueIps}</span>
                        <span className="text-xs text-gray-500">alamat IP</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status WAF Sistem</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-emerald-600">{wafStatus}</span>
                    </div>
                </div>
            </div>

            {/* Visual Charts & Simulation Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Severity Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600" /> Distribusi Severity
                    </h3>
                    <div className="h-[200px] flex items-center justify-center">
                        {severityChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={severityChartData}
                                        innerRadius={45}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {severityChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name.toLowerCase()] || '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1f2937' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Tidak ada data severity</p>
                        )}
                    </div>
                </div>

                {/* Threat Type Bar Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-600" /> Jenis Ancaman
                    </h3>
                    <div className="h-[200px] flex items-center justify-center">
                        {typeChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={typeChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={8} />
                                    <YAxis stroke="#64748b" fontSize={9} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1f2937' }} />
                                    <Bar dataKey="Jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                        {typeChartData.map((entry, index) => {
                                            let color = '#3b82f6';
                                            if (entry.name.includes('SQL')) color = '#ef4444';
                                            if (entry.name.includes('XSS')) color = '#f59e0b';
                                            return <Cell key={`cell-${index}`} fill={color} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Tidak ada data ancaman</p>
                        )}
                    </div>
                </div>

                {/* Threat Simulator Panel */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-emerald-600" /> Uji Coba Alert (Telegram Bot)
                    </h3>
                    <form onSubmit={handleSimulate} className="space-y-4">
                        <div>
                            <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Jenis Serangan</label>
                            <select 
                                value={simulation.type}
                                onChange={(e) => setSimulation({ ...simulation, type: e.target.value })}
                                className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none transition-all text-gray-700"
                            >
                                <option value="sql_injection">SQL Injection</option>
                                <option value="xss_attempt">Cross-Site Scripting (XSS)</option>
                                <option value="login_failed">Failed Login Brute Force</option>
                                <option value="unauthorized_access">Akses Rute Terlarang</option>
                                <option value="file_upload_blocked">Malicious File Upload</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Severity</label>
                            <select 
                                value={simulation.severity}
                                onChange={(e) => setSimulation({ ...simulation, severity: e.target.value })}
                                className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none transition-all text-gray-700"
                            >
                                <option value="low">Low (Biasa)</option>
                                <option value="medium">Medium (Menengah)</option>
                                <option value="high">High (Tinggi)</option>
                                <option value="critical">Critical (Kritis)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Keterangan payload</label>
                            <input 
                                type="text"
                                value={simulation.details}
                                onChange={(e) => setSimulation({ ...simulation, details: e.target.value })}
                                className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none transition-all text-gray-700"
                                placeholder="Detail insiden keamanan simulasi..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={simulating}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm active:scale-[0.98]"
                        >
                            {simulating ? 'Mengirim payload...' : 'Kirim Simulasi Alert'}
                        </button>
                    </form>

                    {simulationResult && (
                        <div className={`mt-4 p-3 rounded-xl border text-[11px] flex items-start gap-2 ${simulationResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {simulationResult.success ? <CheckCircle className="w-4 h-4 shrink-0 text-green-500" /> : <Info className="w-4 h-4 shrink-0 text-red-500" />}
                            <div>{simulationResult.message}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                        <Terminal className="w-5 h-5 text-gray-600" /> Audit Log Aktivitas Keamanan
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari IP / payload..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs focus:outline-none transition-all text-gray-700"
                            />
                        </div>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none transition-all text-gray-600"
                        >
                            <option value="all">Semua Tipe</option>
                            <option value="sql_injection">SQL Injection</option>
                            <option value="xss_attempt">XSS Attack</option>
                            <option value="login_failed">Login Failed</option>
                            <option value="unauthorized_access">Akses Ilegal</option>
                            <option value="file_upload_blocked">File Upload Blocked</option>
                        </select>
                        <select 
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none transition-all text-gray-600"
                        >
                            <option value="all">Semua Severity</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400 text-xs italic">Memuat log keamanan dari database...</div>
                    ) : filteredAlerts.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Waktu</th>
                                    <th className="px-6 py-4">Tipe Event</th>
                                    <th className="px-6 py-4">Bahaya</th>
                                    <th className="px-6 py-4">IP Penyerang</th>
                                    <th className="px-6 py-4 max-w-xs">Detail Payload / Aktivitas</th>
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4">User Agent</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs text-gray-600 divide-y divide-gray-100">
                                {filteredAlerts.map((alert) => (
                                    <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">
                                            {new Date(alert.created_at).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            <div className="flex items-center gap-1.5">
                                                {getEventIcon(alert.event_type)}
                                                <span>{alert.event_type.replace('_', ' ').toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getSeverityBadge(alert.severity)}</td>
                                        <td className="px-6 py-4 font-mono text-blue-600 font-semibold">{alert.ip_address}</td>
                                        <td className="px-6 py-4 max-w-xs truncate font-mono text-gray-500" title={alert.details}>
                                            {alert.details}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {alert.user ? (
                                                <span className="font-bold text-gray-700">{alert.user.name} <p className="text-[10px] text-gray-400 font-normal">{alert.user.email}</p></span>
                                            ) : (
                                                <span className="italic text-gray-400">Guest Session</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 max-w-[150px] truncate" title={alert.user_agent}>
                                            {alert.user_agent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-xs italic">Tidak ada log keamanan yang terdaftar.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
