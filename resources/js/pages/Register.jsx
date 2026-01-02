/**
 * Register Page Component
 * - Split layout: Form on left, image on right
 * - Matches landing page design with green theme
 * - Responsive: image hidden on mobile
 */
import { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Leaf, Store, ShoppingBasket } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'pembeli'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data.message || 'Terjadi kesalahan saat pendaftaran');
                }
                return;
            }

            // Success - Redirect based on role
            window.location.href = data.user.role === 'petani' ? '/farmer/dashboard' : '/buyer/dashboard';
        } catch (error) {
            console.error('Registration error:', error);
            alert('Gagal menghubungkan ke server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Register Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-md w-full space-y-8 py-12 animate-slide-up">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Buat{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                Akun Baru
                            </span>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Bergabunglah dengan ribuan petani dan pembeli di AgriMatch
                        </p>
                    </div>

                    {/* Register Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.role === 'pembeli' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="pembeli"
                                        checked={formData.role === 'pembeli'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <ShoppingBasket className={`w-8 h-8 mb-2 ${formData.role === 'pembeli' ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-semibold ${formData.role === 'pembeli' ? 'text-green-700' : 'text-gray-600'}`}>Pembeli</span>
                                    <p className="text-xs text-center text-gray-500 mt-1">Ingin mencari produk segar</p>
                                </label>
                                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.role === 'petani' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="petani"
                                        checked={formData.role === 'petani'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <Store className={`w-8 h-8 mb-2 ${formData.role === 'petani' ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-semibold ${formData.role === 'petani' ? 'text-green-700' : 'text-gray-600'}`}>Petani</span>
                                    <p className="text-xs text-center text-gray-500 mt-1">Ingin menjual hasil panen</p>
                                </label>
                            </div>

                            {/* Full Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-2 text-sm">
                                <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                                    Saya setuju dengan{' '}
                                    <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                        Syarat & Ketentuan
                                    </a>{' '}
                                    dan{' '}
                                    <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                        Kebijakan Privasi
                                    </a>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg shadow-green-600/25 hover:shadow-green-600/40 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Memproses...' : 'Daftar Sekarang'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">atau</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <a href="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                                    Masuk di sini
                                </a>
                            </p>
                        </div>
                    </form>

                    {/* Back to Homepage Link */}
                    <div className="text-center pt-4">
                        <a href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/images/register-bg.png')`,
                    }}
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-green-900/40 to-green-900/60" />

                {/* Content Overlay */}
                <div className="relative h-full flex flex-col items-center justify-center px-12 text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                        <Leaf className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Mudah & Terpercaya</span>
                    </div>
                    <h3 className="text-4xl font-bold mb-4 text-center">
                        Mulai{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                            Perjalanan
                        </span>
                        {' '}Anda
                    </h3>
                    <p className="text-lg text-white/80 text-center max-w-md mb-8">
                        Akses langsung ke ribuan petani lokal dan produk pertanian berkualitas tinggi
                    </p>

                    {/* Feature List */}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-white/90">Gratis untuk bergabung</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-white/90">Transaksi aman & terpercaya</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-white/90">Dukungan pelanggan 24/7</span>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-700" />
            </div>
        </div>
    );
}
