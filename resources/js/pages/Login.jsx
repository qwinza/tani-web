/**
 * Login Page Component
 * - Split layout: Form on left, image on right
 * - Matches landing page design with green theme
 * - Responsive: image hidden on mobile
 */
import { useState } from 'react';
import { Mail, Lock, ArrowRight, Leaf } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/api/login', {
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
                    alert(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
                }
                return;
            }

            const role = data.user.role;
            if (role === 'superadmin') {
                window.location.href = '/admin/dashboard';
            } else if (role === 'petani') {
                window.location.href = '/farmer/dashboard';
            } else {
                window.location.href = '/buyer/dashboard';
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Gagal menghubungkan ke server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-md w-full space-y-8 animate-slide-up">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Masuk ke{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                Akun Anda
                            </span>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Selamat datang kembali! Silakan masuk untuk melanjutkan
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                    Lupa password?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg shadow-green-600/25 hover:shadow-green-600/40 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Masuk...' : 'Masuk'}
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

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <a href="/register" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                                    Daftar sekarang
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
                        backgroundImage: `url('/images/login-bg.png')`,
                    }}
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-green-900/40 to-green-900/60" />

                {/* Content Overlay */}
                <div className="relative h-full flex flex-col items-center justify-center px-12 text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                        <Leaf className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Platform Pertanian Terpercaya</span>
                    </div>
                    <h3 className="text-4xl font-bold mb-4 text-center">
                        Bergabung dengan{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                            Komunitas
                        </span>
                    </h3>
                    <p className="text-lg text-white/80 text-center max-w-md">
                        Ribuan petani dan pembeli telah mempercayai AgriMatch untuk transaksi pertanian mereka
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-700" />
            </div>
        </div>
    );
}
