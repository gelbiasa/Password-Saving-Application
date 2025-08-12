import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const DashboardAdmin = () => {
    const [data, setData] = useState({
        totalUsers: 0,
        totalKategoriPassword: 0,
        totalDetailPassword: 0,
        activeUsers: 0,
        blockedUsers: 0,
        recentUsers: [],
        userStatistics: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardAdminData();
    }, []);

    const fetchDashboardAdminData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/dashboard-admin-data');
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard admin data:', error);
            // Fallback data untuk demo
            setData({
                totalUsers: 15,
                totalKategoriPassword: 8,
                totalDetailPassword: 45,
                activeUsers: 12,
                blockedUsers: 3,
                recentUsers: [
                    { nama: 'John Doe', email: 'john@example.com', last_login: '2 jam lalu', status: 'active' },
                    { nama: 'Jane Smith', email: 'jane@example.com', last_login: '1 hari lalu', status: 'active' },
                    { nama: 'Bob Wilson', email: 'bob@example.com', last_login: '3 hari lalu', status: 'blocked' }
                ],
                userStatistics: [
                    { kategori: 'Email', total_password: 15 },
                    { kategori: 'Social Media', total_password: 12 },
                    { kategori: 'Banking', total_password: 8 },
                    { kategori: 'Gaming', total_password: 6 },
                    { kategori: 'Work', total_password: 4 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-spin flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-lg font-semibold">Memuat Dashboard Admin...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Full Height */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <Header />
                
                {/* Background dengan tema gelap */}
                <main className="flex-1 p-6 bg-gradient-to-br from-slate-100 via-blue-100 to-gray-100 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-l from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
                    
                    <div className="space-y-6 max-w-7xl relative z-10">
                        {/* Page Header */}
                        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl border border-purple-500/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                                        Dashboard Administrator
                                    </h1>
                                    <p className="text-purple-100/80 mt-2 text-sm">
                                        Panel kontrol untuk mengelola pengguna dan monitoring sistem Password Manager.
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-300 text-sm font-medium">Admin Panel Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AdminStatCard 
                                title="Total Pengguna"
                                value={data.totalUsers}
                                subtitle={`${data.activeUsers} aktif, ${data.blockedUsers} diblokir`}
                                color="blue"
                                icon="users"
                            />
                            <AdminStatCard 
                                title="Kategori Password"
                                value={data.totalKategoriPassword}
                                subtitle="Kategori tersedia"
                                color="green"
                                icon="folder"
                            />
                            <AdminStatCard 
                                title="Total Password"
                                value={data.totalDetailPassword}
                                subtitle="Password tersimpan"
                                color="purple"
                                icon="key"
                            />
                        </div>

                        {/* User Statistics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Users */}
                            <RecentUsersTable users={data.recentUsers} />
                            
                            {/* Password Categories Chart */}
                            <PasswordCategoriesChart statistics={data.userStatistics} />
                        </div>

                        {/* User Status Overview */}
                        <UserStatusOverview 
                            activeUsers={data.activeUsers}
                            blockedUsers={data.blockedUsers}
                            totalUsers={data.totalUsers}
                        />
                        
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

// Component untuk kartu statistik admin
const AdminStatCard = ({ title, value, subtitle, color, icon }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30',
            text: 'bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent',
            border: 'border-blue-500/20',
            hover: 'hover:border-blue-400/40'
        },
        green: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30',
            text: 'bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent',
            border: 'border-green-500/20',
            hover: 'hover:border-green-400/40'
        },
        purple: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30',
            text: 'bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent',
            border: 'border-purple-500/20',
            hover: 'hover:border-purple-400/40'
        }
    };

    const iconPaths = {
        users: "M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 7h1v1H5V7zm4 0h1v1H9V7zm4 0h1v1h-1V7zM7 9h1v1H7V9zm4 0h1v1h-1V9zM5 11h1v1H5v-1zm4 0h1v1H9v-1zm4 0h1v1h-1v-1z",
        folder: "M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z",
        key: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
    };

    return (
        <div className={`${colorClasses[color].bg} backdrop-blur-xl p-6 rounded-xl shadow-2xl transition-all duration-300 border ${colorClasses[color].border} ${colorClasses[color].hover} hover:scale-105 group`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-14 h-14 ${colorClasses[color].icon} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path d={iconPaths[icon]}></path>
                        </svg>
                    </div>
                </div>
                <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className={`text-3xl font-bold ${colorClasses[color].text} group-hover:scale-105 transition-transform duration-300`}>
                        {value}
                    </p>
                    <p className="text-xs text-purple-200/60 mt-1">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

// Component untuk tabel pengguna terbaru
const RecentUsersTable = ({ users }) => {
    return (
        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/20">
            <div className="p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Pengguna Terbaru
                </h2>
            </div>
            <div className="p-6">
                <div className="overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-purple-500/20">
                                <th className="text-left py-3 px-4 text-purple-300 font-semibold text-sm">Nama</th>
                                <th className="text-left py-3 px-4 text-purple-300 font-semibold text-sm">Email</th>
                                <th className="text-left py-3 px-4 text-purple-300 font-semibold text-sm">Last Login</th>
                                <th className="text-left py-3 px-4 text-purple-300 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors duration-200">
                                    <td className="py-3 px-4 text-purple-100 text-sm font-medium">{user.nama}</td>
                                    <td className="py-3 px-4 text-purple-200/80 text-sm">{user.email}</td>
                                    <td className="py-3 px-4 text-purple-200/60 text-xs">{user.last_login}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.status === 'active' 
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        }`}>
                                            {user.status === 'active' ? 'Aktif' : 'Diblokir'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Component untuk chart kategori password
const PasswordCategoriesChart = ({ statistics }) => {
    return (
        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/20">
            <div className="p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Distribusi Password per Kategori
                </h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {statistics.map((item, index) => {
                        const maxValue = Math.max(...statistics.map(s => s.total_password));
                        const percentage = (item.total_password / maxValue) * 100;
                        
                        return (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="w-24 text-sm text-purple-200 font-medium">
                                    {item.kategori}
                                </div>
                                <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right text-sm text-purple-300 font-semibold">
                                    {item.total_password}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Component untuk overview status pengguna
const UserStatusOverview = ({ activeUsers, blockedUsers, totalUsers }) => {
    const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    const blockedPercentage = totalUsers > 0 ? (blockedUsers / totalUsers) * 100 : 0;

    return (
        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/20">
            <div className="p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Status Pengguna
                </h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Users */}
                    <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="stroke-gray-700"
                                    strokeWidth="3"
                                    fill="transparent"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="stroke-green-500"
                                    strokeWidth="3"
                                    strokeDasharray={`${activePercentage}, 100`}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-green-400">{activeUsers}</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-green-300">Pengguna Aktif</h3>
                        <p className="text-green-200/60 text-sm">{activePercentage.toFixed(1)}% dari total</p>
                    </div>

                    {/* Blocked Users */}
                    <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="stroke-gray-700"
                                    strokeWidth="3"
                                    fill="transparent"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="stroke-red-500"
                                    strokeWidth="3"
                                    strokeDasharray={`${blockedPercentage}, 100`}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-red-400">{blockedUsers}</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-red-300">Pengguna Diblokir</h3>
                        <p className="text-red-200/60 text-sm">{blockedPercentage.toFixed(1)}% dari total</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;