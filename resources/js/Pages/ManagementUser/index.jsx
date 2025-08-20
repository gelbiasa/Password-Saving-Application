import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import Sidebar from '../../Components/Sidebar';
import Footer from '../../Components/Footer';
import { useNotification } from '../../Hooks/useNotification';

const ManagementUserIndex = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [statistics, setStatistics] = useState({
        total_users: 0,
        active_users: 0,
        blocked_users: 0
    });
    const [currentUser, setCurrentUser] = useState(null);

    // Use notification hook
    const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();

    useEffect(() => {
        fetchData();
        fetchStatistics();
        fetchCurrentUser();
    }, []);

    // ✅ Fetch current user untuk cek permission
    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('/api/current-user');
            if (response.data.success) {
                setCurrentUser(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    // ✅ Check if current user is admin
    const isAdmin = () => {
        return currentUser && currentUser.hak_akses && currentUser.hak_akses.kode === 'ADM';
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('🔍 Management User - Fetching data...');
            
            const response = await axios.get('/api/users');
            console.log('📊 Management User - Response:', response.data);
            
            if (response.data.success) {
                setData(response.data.data);
                console.log('✅ Management User - Data loaded:', response.data.data.length, 'users');
            } else {
                throw new Error(response.data.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('❌ Management User - Error:', error);
            showError('Gagal memuat data user: ' + error.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/users/statistics');
            if (response.data.success) {
                setStatistics(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            fetchData();
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/users/search', {
                params: { keyword: searchKeyword }
            });
            
            if (response.data.success) {
                setData(response.data.data);
                showSuccess(`Ditemukan ${response.data.total} user dengan keyword "${searchKeyword}"`);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            showError('Gagal melakukan pencarian: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleShowDetail = async (user) => {
        try {
            console.log('🔍 Fetching user detail for ID:', user.m_user_id);
            
            const response = await axios.get(`/api/users/${user.m_user_id}`);
            
            if (response.data.success) {
                setSelectedUser(response.data.data);
                setShowDetailModal(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching user detail:', error);
            showError('Gagal memuat detail user: ' + error.message);
        }
    };

    const handleBlockUser = async (userId) => {
        if (!isAdmin()) {
            showError('Anda tidak memiliki hak akses untuk memblokir user');
            return;
        }

        if (confirm('Apakah Anda yakin ingin memblokir user ini?')) {
            try {
                setLoadingAction(true);
                
                const response = await axios.post(`/api/users/${userId}/block`);
                
                if (response.data.success) {
                    showSuccess(response.data.message);
                    fetchData(); // Refresh data
                    fetchStatistics(); // Refresh statistics
                    
                    if (selectedUser && selectedUser.m_user_id === userId) {
                        setShowDetailModal(false); // Close modal if blocking current viewed user
                    }
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error('Error blocking user:', error);
                const errorMessage = error.response?.data?.message || error.message;
                showError('Gagal memblokir user: ' + errorMessage);
            } finally {
                setLoadingAction(false);
            }
        }
    };

    const handleUnblockUser = async (userId) => {
        if (!isAdmin()) {
            showError('Anda tidak memiliki hak akses untuk membuka blokir user');
            return;
        }

        if (confirm('Apakah Anda yakin ingin membuka blokir user ini?')) {
            try {
                setLoadingAction(true);
                
                const response = await axios.post(`/api/users/${userId}/unblock`);
                
                if (response.data.success) {
                    showSuccess(response.data.message);
                    fetchData(); // Refresh data
                    fetchStatistics(); // Refresh statistics
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error('Error unblocking user:', error);
                const errorMessage = error.response?.data?.message || error.message;
                showError('Gagal membuka blokir user: ' + errorMessage);
            } finally {
                setLoadingAction(false);
            }
        }
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedUser(null);
    };

    const handleRefresh = () => {
        setSearchKeyword('');
        fetchData();
        fetchStatistics();
    };

    return (
        <div className="min-h-screen flex">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
                    notification.type === 'success' ? 'bg-green-500 text-white' : 
                    notification.type === 'error' ? 'bg-red-500 text-white' : 
                    'bg-yellow-500 text-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <span>{notification.message}</span>
                        <button onClick={hideNotification} className="ml-4 text-white hover:text-gray-200">
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar activeMenu="management-user" />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Header />
                
                <main className="flex-1 p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-gray-100 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-l from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
                    
                    <div className="space-y-6 max-w-7xl relative z-10">
                        {/* Page Header */}
                        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl border border-amber-500/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                        Management User
                                    </h1>
                                    <p className="text-amber-100/80 mt-2 text-sm">
                                        Kelola pengguna aplikasi dan kontrol akses sistem
                                    </p>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={handleRefresh}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg"
                                        disabled={loading}
                                    >
                                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Refresh</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="Total User"
                                value={statistics.total_users}
                                color="blue"
                                icon="users"
                            />
                            <StatCard 
                                title="User Aktif"
                                value={statistics.active_users}
                                color="green"
                                icon="check"
                            />
                            <StatCard 
                                title="User Diblokir"
                                value={statistics.blocked_users}
                                color="red"
                                icon="ban"
                            />
                        </div>

                        {/* Search Section */}
                        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/20 p-6">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan username, nama, atau email..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-200"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg"
                                >
                                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Cari</span>
                                </button>
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/20">
                            <div className="p-6 border-b border-amber-500/20">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                        Daftar User
                                    </h2>
                                    <span className="text-sm text-amber-300">
                                        Total: {data.length} user
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <UserTableSkeleton />
                                ) : data.length === 0 ? (
                                    <EmptyState onRefresh={handleRefresh} />
                                ) : (
                                    <UserTable 
                                        users={data} 
                                        onShowDetail={handleShowDetail}
                                        onBlockUser={handleBlockUser}
                                        onUnblockUser={handleUnblockUser}
                                        loadingAction={loadingAction}
                                        isAdmin={isAdmin()}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <Footer />
                </main>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedUser && (
                <UserDetailModal 
                    user={selectedUser} 
                    onClose={handleCloseDetailModal}
                    onBlockUser={handleBlockUser}
                    onUnblockUser={handleUnblockUser}
                    loadingAction={loadingAction}
                    isAdmin={isAdmin()}
                />
            )}
        </div>
    );
};

// ✅ Statistics Card Component
const StatCard = ({ title, value, color, icon }) => {
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
        red: {
            bg: 'bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95',
            icon: 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30',
            text: 'bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent',
            border: 'border-red-500/20',
            hover: 'hover:border-red-400/40'
        }
    };

    const iconPaths = {
        users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
        check: "M5 13l4 4L19 7",
        ban: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
    };

    return (
        <div className={`${colorClasses[color].bg} backdrop-blur-xl p-6 rounded-xl shadow-2xl transition-all duration-300 border ${colorClasses[color].border} ${colorClasses[color].hover} hover:scale-105 group`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${colorClasses[color].icon} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[icon]} />
                        </svg>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-semibold text-amber-300 group-hover:text-amber-200 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className={`text-3xl font-bold ${colorClasses[color].text} group-hover:scale-105 transition-transform duration-300`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ✅ User Table Component
const UserTable = ({ users, onShowDetail, onBlockUser, onUnblockUser, loadingAction, isAdmin }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-amber-500/20">
                        <th className="text-left text-amber-300 font-semibold pb-4">No</th>
                        <th className="text-left text-amber-300 font-semibold pb-4">Username</th>
                        <th className="text-left text-amber-300 font-semibold pb-4">Nama Pengguna</th>
                        <th className="text-left text-amber-300 font-semibold pb-4">Email</th>
                        <th className="text-left text-amber-300 font-semibold pb-4">Hak Akses</th>
                        <th className="text-left text-amber-300 font-semibold pb-4">Status</th>
                        <th className="text-left text-amber-300 font-semibold pb-4">Total Password</th>
                        <th className="text-center text-amber-300 font-semibold pb-4">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.m_user_id} className="border-b border-amber-500/10 hover:bg-amber-500/5 transition-colors duration-200">
                            <td className="py-4 text-amber-100">{index + 1}</td>
                            <td className="py-4 text-amber-100 font-medium">{user.username}</td>
                            <td className="py-4 text-amber-100">{user.nama_pengguna}</td>
                            <td className="py-4 text-amber-100">{user.email_pengguna}</td>
                            <td className="py-4 text-amber-100">
                                <div className="flex flex-wrap gap-1">
                                    {user.hak_akses.map((akses, idx) => (
                                        <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                            {akses.hak_akses_nama}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status_class === 'active' 
                                        ? 'bg-green-500/20 text-green-300' 
                                        : 'bg-red-500/20 text-red-300'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="py-4 text-amber-100">
                                <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs">
                                    {user.total_passwords} password
                                </span>
                            </td>
                            <td className="py-4 text-center">
                                <div className="flex justify-center space-x-2">
                                    {/* Detail Button */}
                                    <button
                                        onClick={() => onShowDetail(user)}
                                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 p-2 rounded-lg transition-all duration-200"
                                        title="Detail"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>

                                    {/* Block/Unblock Button - Only for Admin */}
                                    {isAdmin && (
                                        user.is_blocked ? (
                                            <button
                                                onClick={() => onUnblockUser(user.m_user_id)}
                                                disabled={loadingAction}
                                                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                                                title="Buka Blokir"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onBlockUser(user.m_user_id)}
                                                disabled={loadingAction}
                                                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                                                title="Blokir User"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                </svg>
                                            </button>
                                        )
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ✅ User Detail Modal Component
const UserDetailModal = ({ user, onClose, onBlockUser, onUnblockUser, loadingAction, isAdmin }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

                {/* Modal */}
                <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl rounded-2xl border border-amber-500/20">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                            Detail User
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-amber-300 hover:text-amber-100 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="py-6 space-y-6">
                        {/* User Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Username</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="text-amber-100">{user.username}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Nama Pengguna</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="text-amber-100">{user.nama_pengguna}</span>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-amber-300 mb-2">Email</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="text-amber-100">{user.email_pengguna}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">No. HP</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="text-amber-100">{user.no_hp_pengguna || '-'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Jenis Kelamin</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="text-amber-100">
                                        {user.jenis_kelamin_pengguna === 'L' ? 'Laki-laki' : 
                                         user.jenis_kelamin_pengguna === 'P' ? 'Perempuan' : '-'}
                                    </span>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-amber-300 mb-2">Alamat</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="text-amber-100">{user.alamat_pengguna || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status and Hak Akses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Status</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        user.status_class === 'active' 
                                            ? 'bg-green-500/20 text-green-300' 
                                            : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Total Password</label>
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                    <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-sm">
                                        {user.total_passwords} password
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-300 mb-2">Hak Akses</label>
                            <div className="p-3 bg-gray-800/50 rounded-lg border border-amber-500/20">
                                <div className="flex flex-wrap gap-2">
                                    {user.hak_akses.map((akses, index) => (
                                        <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm">
                                            {akses.hak_akses_nama}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {isAdmin && (
                        <div className="pt-6 border-t border-amber-500/20">
                            <div className="flex justify-end space-x-3">
                                {user.is_blocked ? (
                                    <button
                                        onClick={() => onUnblockUser(user.m_user_id)}
                                        disabled={loadingAction}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        <span>Buka Blokir</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onBlockUser(user.m_user_id)}
                                        disabled={loadingAction}
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                        </svg>
                                        <span>Blokir User</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ✅ Loading Skeleton Component
const UserTableSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
                <div className="grid grid-cols-8 gap-4 py-4">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                </div>
            </div>
        ))}
    </div>
);

// ✅ Empty State Component
const EmptyState = ({ onRefresh }) => (
    <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
        </div>
        <p className="text-amber-200/60 text-lg mb-4">Tidak ada data user ditemukan</p>
        <p className="text-amber-300/40 text-sm mb-6">Coba refresh halaman atau hubungi administrator</p>
        <button
            onClick={onRefresh}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
            Refresh Data
        </button>
    </div>
);

export default ManagementUserIndex;