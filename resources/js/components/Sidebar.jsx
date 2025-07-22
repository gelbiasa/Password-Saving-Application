import React, { useState, useEffect } from 'react';

const Sidebar = ({ activeMenu = 'dashboard' }) => {
    const [userData, setUserData] = useState({
        nama_pengguna: 'Loading...',
        email_pengguna: 'Loading...',
        foto_profil: '/foto-profile/default-picture.jpg',
        hak_akses: null
    });

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('/api/current-user');
            if (response.data.success) {
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Set default values jika error
            setUserData({
                nama_pengguna: 'User',
                email_pengguna: 'user@example.com',
                foto_profil: '/foto-profile/default-picture.jpg',
                hak_akses: null
            });
        }
    };

    const handleNavigation = (page) => {
        if (page === 'dashboard') {
            window.location.href = '/dashboard';
        } else if (page === 'kategori-password') {
            window.location.href = '/kategori-password';
        }
    };

    // Fungsi untuk mendapatkan inisial nama
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    };

    return (
        <aside className="bg-gray-900 text-white w-56 shadow-lg min-h-screen flex flex-col">
            <div className="p-3 flex-1">
                <div className="mb-6">
                    <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden relative">
                            {userData.foto_profil && userData.foto_profil !== '/foto-profile/default-picture.jpg' ? (
                                <img 
                                    src={userData.foto_profil} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Jika gambar gagal dimuat, tampilkan inisial
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <span 
                                className="text-xs font-bold absolute inset-0 flex items-center justify-center"
                                style={{ display: userData.foto_profil && userData.foto_profil !== '/foto-profile/default-picture.jpg' ? 'none' : 'flex' }}
                            >
                                {getInitials(userData.nama_pengguna)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate" title={userData.nama_pengguna}>
                                {userData.nama_pengguna}
                            </p>
                            <p className="text-xs text-gray-400 truncate" title={userData.email_pengguna}>
                                {userData.email_pengguna}
                            </p>
                            {userData.hak_akses && (
                                <p className="text-xs text-indigo-300 truncate" title={userData.hak_akses.nama}>
                                    {userData.hak_akses.nama}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1">
                    <ul className="space-y-1">
                        <li>
                            <button 
                                onClick={() => handleNavigation('dashboard')}
                                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors text-sm ${
                                    activeMenu === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-800'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span>Dashboard</span>
                            </button>
                        </li>
                        
                        <li>
                            <button 
                                onClick={() => handleNavigation('kategori-password')}
                                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors text-sm ${
                                    activeMenu === 'kategori-password' ? 'bg-indigo-600' : 'hover:bg-gray-800'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                <span>Kategori Password</span>
                                <span className="ml-auto bg-indigo-600 text-xs px-1.5 py-0.5 rounded-full">25</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            
            {/* Status Sistem - Tetap di Bawah */}
            <div className="p-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">Status Sistem: </span>
                        <span className="text-green-400 font-medium">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;