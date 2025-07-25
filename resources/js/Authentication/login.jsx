import React, { useState } from 'react';
import SuccessMessage from '../Feedback-Message/success';
import ErrorMessage from '../Feedback-Message/error';
import { useNotification } from '../Hooks/useNotification';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { notification, showSuccess, showError, hideNotification } = useNotification();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/login', formData);
            
            if (response.data.success) {
                showSuccess(response.data.message, 'Login Berhasil!');
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                showError(
                    error.response.data.message, 
                    'Login Gagal!',
                    () => handleSubmit(e) // Retry function
                );
            } else {
                showError('Terjadi kesalahan saat login!', 'Kesalahan Jaringan!');
            }
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background dengan gradasi emas-hitam dan animasi */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-amber-900"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/10 to-yellow-400/20"></div>
            
            {/* Animated background elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-l from-amber-500/15 to-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400/10 to-amber-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/30">
                        <svg className="h-10 w-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                        Password Manager
                    </h2>
                    <p className="mt-3 text-sm text-amber-100/80 font-medium">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                {/* Form Login */}
                <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 p-8 border border-amber-500/20 ring-1 ring-amber-400/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-amber-300 mb-2">
                                Username
                            </label>
                            <div className="relative group">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-4 bg-gray-800/50 border border-amber-500/30 placeholder-gray-400 text-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-amber-400/50"
                                    placeholder="Masukkan username Anda"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <svg className="h-5 w-5 text-amber-400/70" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-amber-300 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-4 bg-gray-800/50 border border-amber-500/30 placeholder-gray-400 text-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm pr-12 group-hover:border-amber-400/50"
                                    placeholder="Masukkan password Anda"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-amber-300 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-bold">Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                                            <svg className="h-5 w-5 text-black/80 group-hover:text-black transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                            </svg>
                                        </span>
                                        <span className="font-bold tracking-wide">MASUK</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-amber-500/30" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gradient-to-r from-transparent via-gray-900 to-transparent text-amber-300/80 font-medium">
                                    Aplikasi Pengelola Password v1.0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-amber-200/60 font-medium">
                        © 2025 Password Manager. Semua hak dilindungi undang-undang.
                    </p>
                </div>
            </div>
            {/* Notification Components */}
            {notification.type === 'success' && (
                <SuccessMessage
                    message={notification.message}
                    title={notification.title}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                />
            )}
            
            {notification.type === 'error' && (
                <ErrorMessage
                    message={notification.message}
                    title={notification.title}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                    onRetry={notification.onRetry}
                />
            )}
        </div>
    );
};

export default Login;