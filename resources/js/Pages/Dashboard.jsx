import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const Dashboard = () => {
    const [data, setData] = useState({
        totalPasswords: 0,
        weakPasswords: 0,
        strongPasswords: 0,
        recentActivities: [] // ✅ Add recent activities
    });
    
    // ✅ Add loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('📊 Dashboard - Fetching data from /api/dashboard-data...');
            const response = await axios.get('/api/dashboard-data');
            
            console.log('📊 Dashboard - API Response:', response.data);
            
            if (response.data.success) {
                setData(response.data.data);
                console.log('📊 Dashboard - Data set:', response.data.data);
                console.log('📊 Dashboard - Recent Activities:', response.data.data.recentActivities);
            } else {
                throw new Error(response.data.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('📊 Dashboard - Error fetching data:', error);
            setError(error.message);
            
            // Fallback data
            setData({
                totalPasswords: 0,
                weakPasswords: 0,
                strongPasswords: 0,
                recentActivities: []
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Function untuk test password strength (untuk debugging)
    const testPasswordStrength = async (password) => {
        try {
            const response = await axios.post('/api/test-password-strength', {
                password: password
            });
            console.log('🔐 Password Test Result:', response.data);
        } catch (error) {
            console.error('🔐 Password Test Error:', error);
        }
    };

    // ✅ Test different passwords (uncomment untuk testing)
    useEffect(() => {
        // Testing password strength logic
        // testPasswordStrength('michaelkertanegara'); // Should be strong (> 12 chars)
        // testPasswordStrength('Adam@11'); // Should be strong (symbol + number + uppercase)
        // testPasswordStrength('michaelbob'); // Should be weak (< 12 chars, no symbol/number/uppercase)
        // testPasswordStrength('adamsmith12'); // Should be weak (no symbol, no uppercase)
    }, []);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Full Height */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <Header />
                
                {/* Background dengan tema gelap */}
                <main className="flex-1 p-6 bg-gradient-to-br from-slate-100 via-blue-100 to-gray-100 relative">
                    {/* Decorative elements dengan tema gelap */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-l from-amber-600/10 to-yellow-600/10 rounded-full blur-3xl"></div>
                    
                    <div className="space-y-6 max-w-7xl relative z-10">
                        {/* Page Header - Background hitam dengan border emas */}
                        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl border border-amber-500/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                        Dashboard
                                    </h1>
                                    <p className="text-amber-100/80 mt-2 text-sm">
                                        Selamat datang kembali di Password Manager! Berikut adalah ringkasan keamanan password Anda.
                                    </p>
                                </div>
                                
                                {/* ✅ Loading indicator */}
                                {loading && (
                                    <div className="flex items-center space-x-2 text-amber-300">
                                        <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin"></div>
                                        <span className="text-sm">Memuat data...</span>
                                    </div>
                                )}
                                
                                {/* ✅ Error indicator */}
                                {error && (
                                    <div className="flex items-center space-x-2 text-red-300">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="text-sm">Error memuat data</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="Total Password"
                                value={data.totalPasswords}
                                color="blue"
                                icon="lock"
                                loading={loading}
                            />
                            <StatCard 
                                title="Password Lemah"
                                value={data.weakPasswords}
                                color="red"
                                icon="warning"
                                loading={loading}
                            />
                            <StatCard 
                                title="Password Kuat"
                                value={data.strongPasswords}
                                color="green"
                                icon="check"
                                loading={loading}
                            />
                        </div>

                        {/* ✅ Password Strength Info */}
                        <PasswordStrengthInfo />

                        {/* ✅ Recent Activity - Now Dynamic */}
                        <RecentActivity activities={data.recentActivities} loading={loading} />
                        
                        {/* Add padding bottom untuk footer */}
                        <div className="pb-16"></div>
                    </div>
                    
                    {/* Floating Footer */}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

// ✅ Component untuk informasi password strength - UNCHANGED
const PasswordStrengthInfo = () => {
    return (
        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/20">
            <div className="p-6 border-b border-amber-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                    Kriteria Password Kuat
                </h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strong Password Examples */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-green-400">✅ Password Kuat</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="font-mono text-green-300">michaelkertanegara</div>
                                <div className="text-sm text-green-200/80 mt-1">Lebih dari 12 karakter</div>
                            </div>
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="font-mono text-green-300">Adam@11</div>
                                <div className="text-sm text-green-200/80 mt-1">Symbol (@) + Number (11) + Huruf Kapital (A)</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Weak Password Examples */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-red-400">❌ Password Lemah</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="font-mono text-red-300">michaelbob</div>
                                <div className="text-sm text-red-200/80 mt-1">Kurang dari 12 karakter, tidak ada symbol/number/kapital</div>
                            </div>
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="font-mono text-red-300">adamsmith12</div>
                                <div className="text-sm text-red-200/80 mt-1">Tidak ada symbol dan huruf kapital</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component untuk kartu statistik - dengan loading state - UNCHANGED
const StatCard = ({ title, value, color, icon, loading = false }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30',
            text: 'bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent',
            border: 'border-blue-500/20',
            hover: 'hover:border-blue-400/40'
        },
        red: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30',
            text: 'bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent',
            border: 'border-red-500/20',
            hover: 'hover:border-red-400/40'
        },
        green: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30',
            text: 'bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent',
            border: 'border-green-500/20',
            hover: 'hover:border-green-400/40'
        }
    };

    const iconPaths = {
        lock: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
        warning: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
        check: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
    };

    return (
        <div className={`${colorClasses[color].bg} backdrop-blur-xl p-6 rounded-xl shadow-2xl transition-all duration-300 border ${colorClasses[color].border} ${colorClasses[color].hover} hover:scale-105 group`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${colorClasses[color].icon} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                            </svg>
                        )}
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-semibold text-amber-300 group-hover:text-amber-200 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className={`text-3xl font-bold ${colorClasses[color].text} group-hover:scale-105 transition-transform duration-300`}>
                        {loading ? '...' : value}
                    </p>
                </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-amber-500/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-150"></div>
        </div>
    );
};

// ✅ Component untuk recent activity - NOW DYNAMIC
const RecentActivity = ({ activities = [], loading = false }) => {
    console.log('📅 RecentActivity - Received activities:', activities);
    
    const activityColors = {
        green: 'bg-green-500 shadow-green-500/50',
        blue: 'bg-blue-500 shadow-blue-500/50',
        yellow: 'bg-yellow-500 shadow-yellow-500/50',
        red: 'bg-red-500 shadow-red-500/50'
    };

    return (
        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/20">
            <div className="p-6 border-b border-amber-500/20">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                        Aktivitas Terbaru
                    </h2>
                    {loading && (
                        <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin"></div>
                    )}
                </div>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {/* ✅ Loading state */}
                    {loading && (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-amber-500/10 animate-pulse">
                                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                    </div>
                                    <div className="h-3 bg-gray-600 rounded w-20"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✅ Real activities data */}
                    {!loading && activities.length > 0 && activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/60 hover:to-gray-600/60 transition-all duration-300 group border border-amber-500/10 hover:border-amber-400/20">
                            <div className={`w-3 h-3 ${activityColors[activity.color] || activityColors.blue} rounded-full shadow-lg animate-pulse`}></div>
                            <span className="text-sm text-amber-100 group-hover:text-amber-50 transition-colors duration-300 flex-1 font-medium" title={`Kategori: ${activity.kategori} - ${activity.is_strong ? 'Password Kuat' : 'Password Lemah'}`}>
                                {activity.text}
                            </span>
                            <span className="text-xs text-amber-300/80 group-hover:text-amber-200 transition-colors duration-300 font-medium">
                                {activity.time}
                            </span>
                        </div>
                    ))}

                    {/* ✅ Empty state */}
                    {!loading && activities.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-amber-400/60" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <p className="text-amber-200/60 text-sm">Belum ada aktivitas password</p>
                            <p className="text-amber-300/40 text-xs mt-1">Mulai tambahkan password untuk melihat aktivitas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;