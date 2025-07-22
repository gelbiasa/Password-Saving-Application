import React, { useState, useEffect } from 'react';

const Header = () => {
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
            setUserData({
                nama_pengguna: 'User',
                email_pengguna: 'user@example.com',
                foto_profil: '/foto-profile/default-picture.jpg',
                hak_akses: null
            });
        }
    };

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            window.location.href = '/logout';
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    };

    return (
        <header className="bg-gray-700 text-white p-3 shadow-lg border-b border-gray-700">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold">Password Manager</h1>
                </div>
                
                <nav className="flex items-center space-x-3">
                    <div className="relative flex items-center space-x-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden relative">
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
                                className="text-xs font-bold absolute inset-0 flex items-center justify-center"
                                style={{ display: userData.foto_profil && userData.foto_profil !== '/foto-profile/default-picture.jpg' ? 'none' : 'flex' }}
                            >
                                {getInitials(userData.nama_pengguna)}
                            </span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium">{userData.nama_pengguna}</span>
                            {userData.hak_akses && (
                                <span className="text-xs text-indigo-300">{userData.hak_akses.nama}</span>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded transition-colors flex items-center space-x-2 text-sm"
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                        </svg>
                        <span>Keluar</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;