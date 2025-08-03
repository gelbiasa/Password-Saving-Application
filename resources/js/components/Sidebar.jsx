import React, { useState, useEffect } from 'react';

const Sidebar = ({ activeMenu = 'dashboard' }) => {
    const [userData, setUserData] = useState({
        nama_pengguna: 'Loading...',
        email_pengguna: 'Loading...',
        foto_profil: '/foto-profile/default-picture.jpg',
        hak_akses: null
    });

    const [kategoriCount, setKategoriCount] = useState(0);
    const [detailPasswordCount, setDetailPasswordCount] = useState(0);
    const [loadingCount, setLoadingCount] = useState(true);
    const [loadingDetailCount, setLoadingDetailCount] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
        fetchKategoriCount();
        fetchDetailPasswordCount();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('/api/current-user');
            if (response.data.success) {
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData({
                nama_pengguna: 'User',
                email_pengguna: 'user@example.com',
                foto_profil: '/foto-profile/default-picture.jpg',
                hak_akses: null
            });
        }
    };

    const fetchKategoriCount = async () => {
        try {
            setLoadingCount(true);
            const response = await axios.get('/api/kategori-password/count');
            
            if (response.data.success) {
                setKategoriCount(response.data.count);
            } else {
                console.warn('Failed to fetch kategori count:', response.data.message);
                setKategoriCount(0);
            }
        } catch (error) {
            console.error('Error fetching kategori count:', error);
            setKategoriCount(0);
        } finally {
            setLoadingCount(false);
        }
    };

    const fetchDetailPasswordCount = async () => {
        try {
            setLoadingDetailCount(true);
            const response = await axios.get('/api/detail-password/count');
            
            if (response.data.success) {
                setDetailPasswordCount(response.data.count);
            } else {
                console.warn('Failed to fetch detail password count:', response.data.message);
                setDetailPasswordCount(0);
            }
        } catch (error) {
            console.error('Error fetching detail password count:', error);
            setDetailPasswordCount(0);
        } finally {
            setLoadingDetailCount(false);
        }
    };

    const handleNavigation = (page) => {
        if (page === 'dashboard') {
            window.location.href = '/dashboard';
        } else if (page === 'kategori-password') {
            window.location.href = '/kategori-password';
        } else if (page === 'detail-password') {
            window.location.href = '/detail-password';
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    };

    // Function untuk refresh count setelah CRUD operations
    const refreshKategoriCount = () => {
        fetchKategoriCount();
    };

    const refreshDetailPasswordCount = () => {
        fetchDetailPasswordCount();
    };

    // Expose function ke window untuk dipanggil dari komponen lain
    useEffect(() => {
        window.refreshSidebarCounts = () => {
            refreshKategoriCount();
            refreshDetailPasswordCount();
        };
        
        return () => {
            delete window.refreshSidebarCounts;
        };
    }, []);

    return (
        <aside className="bg-gradient-to-b from-gray-900 via-black to-amber-900 text-white w-56 shadow-2xl min-h-screen flex flex-col border-r border-amber-500/20">
            <div className="p-3 flex-1">
                {/* Logo Section */}
                <div className="mb-6 p-3 bg-gradient-to-br from-gray-800/80 via-black/80 to-gray-700/80 backdrop-blur-xl rounded-xl border border-amber-500/20 ring-1 ring-amber-400/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h1 className="text-sm font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                            Password Manager
                        </h1>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 p-3 bg-gradient-to-br from-gray-800/60 via-black/60 to-gray-700/60 backdrop-blur-xl rounded-xl border border-amber-500/20 ring-1 ring-amber-400/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden relative shadow-lg shadow-amber-500/30">
                            {userData.foto_profil && userData.foto_profil !== '/foto-profile/default-picture.jpg' ? (
                                <img 
                                    src={userData.foto_profil} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <span 
                                className="text-xs font-bold absolute inset-0 flex items-center justify-center text-black"
                                style={{ display: userData.foto_profil && userData.foto_profil !== '/foto-profile/default-picture.jpg' ? 'none' : 'flex' }}
                            >
                                {getInitials(userData.nama_pengguna)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-amber-100" title={userData.nama_pengguna}>
                                {userData.nama_pengguna}
                            </p>
                            <p className="text-xs text-amber-300/70 truncate" title={userData.email_pengguna}>
                                {userData.email_pengguna}
                            </p>
                            {userData.hak_akses && (
                                <p className="text-xs text-amber-400 truncate" title={userData.hak_akses.nama}>
                                    {userData.hak_akses.nama}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Navigation Menu */}
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <button 
                                onClick={() => handleNavigation('dashboard')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 text-sm group ${
                                    activeMenu === 'dashboard' 
                                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/30 shadow-lg shadow-amber-500/25 text-amber-100' 
                                        : 'hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-yellow-600/10 hover:border-amber-400/20 border border-transparent text-amber-200/80 hover:text-amber-100'
                                }`}
                            >
                                <svg className={`w-4 h-4 ${activeMenu === 'dashboard' ? 'text-amber-400' : 'text-amber-300/70 group-hover:text-amber-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span className="font-medium">Dashboard</span>
                                {activeMenu === 'dashboard' && (
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </button>
                        </li>
                        
                        <li>
                            <button 
                                onClick={() => handleNavigation('kategori-password')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 text-sm group ${
                                    activeMenu === 'kategori-password' 
                                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/30 shadow-lg shadow-amber-500/25 text-amber-100' 
                                        : 'hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-yellow-600/10 hover:border-amber-400/20 border border-transparent text-amber-200/80 hover:text-amber-100'
                                }`}
                            >
                                <svg className={`w-4 h-4 ${activeMenu === 'kategori-password' ? 'text-amber-400' : 'text-amber-300/70 group-hover:text-amber-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="font-medium">Kategori Password</span>
                                
                                {/* Dynamic Count Badge */}
                                <div className="ml-auto flex items-center space-x-2">
                                    {loadingCount ? (
                                        <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold shadow-lg min-w-[1.5rem] text-center">
                                            {kategoriCount}
                                        </span>
                                    )}
                                    
                                    {activeMenu === 'kategori-password' && (
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            </button>
                        </li>

                        <li>
                            <button 
                                onClick={() => handleNavigation('detail-password')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 text-sm group ${
                                    activeMenu === 'detail-password' 
                                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/30 shadow-lg shadow-amber-500/25 text-amber-100' 
                                        : 'hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-yellow-600/10 hover:border-amber-400/20 border border-transparent text-amber-200/80 hover:text-amber-100'
                                }`}
                            >
                                <svg className={`w-4 h-4 ${activeMenu === 'detail-password' ? 'text-amber-400' : 'text-amber-300/70 group-hover:text-amber-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span className="font-medium">Detail Password</span>
                                
                                {/* Dynamic Count Badge */}
                                <div className="ml-auto flex items-center space-x-2">
                                    {loadingDetailCount ? (
                                        <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold shadow-lg min-w-[1.5rem] text-center">
                                            {detailPasswordCount}
                                        </span>
                                    )}
                                    
                                    {activeMenu === 'detail-password' && (
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            
            {/* Status Sistem - Tetap di Bawah */}
            <div className="p-3">
                <div className="p-3 bg-gradient-to-br from-gray-800/60 via-black/60 to-gray-700/60 backdrop-blur-xl rounded-xl border border-amber-500/20 ring-1 ring-amber-400/10">
                    <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                        <span className="text-amber-200/80">Status: </span>
                        <span className="text-green-400 font-semibold">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;