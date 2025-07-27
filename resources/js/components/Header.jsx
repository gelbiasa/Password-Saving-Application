import React, { useState, useEffect } from 'react';
import SuccessMessage from '../Feedback-Message/success';
import ErrorMessage from '../Feedback-Message/error';
import { useNotification } from '../Hooks/useNotification';

const Header = () => {
    const [userData, setUserData] = useState({
        nama_pengguna: 'Loading...',
        email_pengguna: 'Loading...',
        foto_profil: '/foto-profile/default-picture.jpg',
        hak_akses: null
    });
    const { notification, showSuccess, showError, hideNotification } = useNotification();

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
        showError(
            'Apakah Anda yakin ingin keluar dari sistem? Semua sesi aktif akan berakhir.',
            'Konfirmasi Logout',
            () => {
                // Jika user mengklik "Coba Lagi" (dalam konteks ini artinya "Ya, Logout")
                performLogout();
            }
        );
    };

    const performLogout = async () => {
        try {
            // Tampilkan loading message
            showSuccess('Sedang memproses logout...', 'Memproses...');
            
            // Simulate logout process
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Tampilkan success message
            showSuccess(
                `Terima kasih ${userData.nama_pengguna}! Anda berhasil keluar dari sistem.`,
                'Logout Berhasil!'
            );
            
            // Redirect setelah delay
            setTimeout(() => {
                window.location.href = '/logout';
            }, 2000);
            
        } catch (error) {
            console.error('Error during logout:', error);
            showError(
                'Terjadi kesalahan saat logout. Silakan coba lagi.',
                'Logout Gagal!',
                () => performLogout() // Retry function
            );
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            <header className="bg-gradient-to-r from-gray-900 via-black to-amber-900 text-white p-3 shadow-2xl border-b border-amber-500/20">
                <div className="flex justify-between items-center px-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                            Password Manager
                        </h1>
                    </div>
                    
                    <nav className="flex items-center space-x-3">
                        <div className="relative flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden relative shadow-lg shadow-amber-500/30">
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
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-medium text-amber-100">{userData.nama_pengguna}</span>
                                {userData.hak_akses && (
                                    <span className="text-xs text-amber-300">{userData.hak_akses.nama}</span>
                                )}
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-semibold transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                            </svg>
                            <span>Keluar</span>
                        </button>
                    </nav>
                </div>
            </header>

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
        </>
    );
};

export default Header;