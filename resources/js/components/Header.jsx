import React, { useState, useEffect } from 'react';
import SuccessMessage from '../Feedback-Message/success';
import ErrorMessage from '../Feedback-Message/error';
import LogoutMessage from '../Feedback-Message/logout';
import { useNotification } from '../Hooks/useNotification';

const Header = () => {
    const [userData, setUserData] = useState({
        nama_pengguna: 'Loading...',
        email_pengguna: 'Loading...',
        foto_profil: null,
        hak_akses: null
    });
    
    // ✅ New state untuk dropdown dan hak akses list
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hakAksesList, setHakAksesList] = useState([]);
    const [loadingSwitch, setLoadingSwitch] = useState(false);
    
    const { notification, showSuccess, showError, showLogout, hideNotification } = useNotification();

    useEffect(() => {
        fetchCurrentUser();
        fetchUserHakAksesList();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            console.log('📸 Header - Calling API /api/current-user...');
            const response = await axios.get('/api/current-user');
            console.log('📸 Header - API Response:', response.data);
            
            if (response.data.success) {
                console.log('📸 Header - Setting userData:', response.data.data);
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error('📸 Header - Error fetching user data:', error);
            setUserData({
                nama_pengguna: 'User',
                email_pengguna: 'user@example.com',
                foto_profil: null,
                hak_akses: null
            });
        }
    };

    // ✅ New function untuk fetch hak akses list
    const fetchUserHakAksesList = async () => {
        try {
            const response = await axios.get('/api/user-hak-akses-list');
            if (response.data.success) {
                setHakAksesList(response.data.data.hak_akses_list);
                console.log('📋 Header - Hak akses list:', response.data.data.hak_akses_list);
            }
        } catch (error) {
            console.error('📋 Header - Error fetching hak akses list:', error);
        }
    };

    // ✅ New function untuk switch hak akses
    const handleSwitchHakAkses = async (hakAksesId, hakAksesNama) => {
        if (loadingSwitch) return;
        
        try {
            setLoadingSwitch(true);
            setIsDropdownOpen(false);
            
            showSuccess('Mengubah hak akses...', 'Sedang Memproses');
            
            const response = await axios.post('/api/switch-hak-akses', {
                hak_akses_id: hakAksesId
            });
            
            if (response.data.success) {
                // Update userData dengan hak akses baru
                setUserData(prev => ({
                    ...prev,
                    hak_akses: response.data.data.hak_akses
                }));
                
                // Refresh hak akses list untuk update status 'is_current'
                await fetchUserHakAksesList();
                
                showSuccess(
                    `Hak akses berhasil diubah ke: ${hakAksesNama}`,
                    'Berhasil!'
                );
                
                // Refresh halaman setelah 2 detik untuk memastikan UI ter-update
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            } else {
                showError(
                    response.data.message || 'Gagal mengubah hak akses',
                    'Error!'
                );
            }
        } catch (error) {
            console.error('Error switching hak akses:', error);
            showError(
                'Terjadi kesalahan saat mengubah hak akses',
                'Error!',
                () => handleSwitchHakAkses(hakAksesId, hakAksesNama)
            );
        } finally {
            setLoadingSwitch(false);
        }
    };

    const handleLogout = () => {
        setIsDropdownOpen(false);
        showLogout(
            'Semua sesi aktif akan berakhir dan Anda perlu login kembali untuk mengakses aplikasi.',
            'Konfirmasi Logout',
            () => {
                performLogout();
            },
            userData.nama_pengguna || 'User'
        );
    };

    const performLogout = async () => {
        try {
            showSuccess('Sedang memproses logout...', 'Memproses...');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showSuccess(
                `Terima kasih ${userData.nama_pengguna}! Anda berhasil keluar dari sistem.`,
                'Logout Berhasil!'
            );
            
            setTimeout(() => {
                window.location.href = '/logout';
            }, 2000);
            
        } catch (error) {
            console.error('Error during logout:', error);
            showError(
                'Terjadi kesalahan saat logout. Silakan coba lagi.',
                'Logout Gagal!',
                () => performLogout()
            );
        }
    };

    const getInitials = (name) => {
        if (!name || name === 'Loading...') return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    };

    const isDefaultPhoto = (fotoPath) => {
        return true; // Force true untuk testing
    };

    const getBadgeColor = (hakAkses) => {
        if (!hakAkses) return 'bg-gray-500/30 text-gray-200 border-gray-400/40';
        
        const nama = hakAkses.nama.toLowerCase();
        
        if (nama.includes('administrator') || nama.includes('admin')) {
            return 'bg-gradient-to-r from-emerald-400/30 to-green-500/30 text-emerald-200 border-emerald-400/50 shadow-lg shadow-emerald-500/20';
        } else if (nama.includes('manager') || nama.includes('supervisor')) {
            return 'bg-gradient-to-r from-teal-400/30 to-cyan-500/30 text-teal-200 border-teal-400/50 shadow-lg shadow-teal-500/20';
        } else if (nama.includes('user') || nama.includes('pengguna')) {
            return 'bg-gradient-to-r from-green-400/30 to-lime-500/30 text-green-200 border-green-400/50 shadow-lg shadow-green-500/20';
        } else if (nama.includes('guest') || nama.includes('tamu')) {
            return 'bg-gradient-to-r from-slate-400/30 to-gray-500/30 text-slate-200 border-slate-400/50 shadow-lg shadow-slate-500/20';
        } else {
            return 'bg-gradient-to-r from-lime-400/30 to-yellow-500/30 text-lime-200 border-lime-400/50 shadow-lg shadow-lime-500/20';
        }
    };

    // ✅ Function untuk get available hak akses (yang bukan current)
    const getAvailableHakAkses = () => {
        return hakAksesList.filter(item => !item.is_current);
    };

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                        <div className="relative flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden relative shadow-lg shadow-amber-500/30">
                                {/* Profile Photo/Initials */}
                                <span 
                                    className="initials-fallback text-sm font-bold absolute inset-0 flex items-center justify-center text-black"
                                    style={{ display: 'flex' }}
                                >
                                    {getInitials(userData.nama_pengguna)}
                                </span>
                            </div>
                            
                            <div className="flex flex-col text-right">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-medium text-amber-100">
                                        {userData.nama_pengguna}
                                    </span>
                                    {userData.hak_akses && (
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 ${getBadgeColor(userData.hak_akses)}`}>
                                            {userData.hak_akses.nama}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-amber-200/80">{userData.email_pengguna}</span>
                            </div>
                        </div>
                        
                        {/* ✅ Dropdown Button */}
                        <div className="relative dropdown-container">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                disabled={loadingSwitch}
                                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-semibold transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingSwitch ? (
                                    <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                )}
                                <span>Menu</span>
                            </button>

                            {/* ✅ Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/30 ring-1 ring-amber-400/20 z-50 overflow-hidden">
                                    {/* Header Dropdown */}
                                    <div className="px-4 py-3 border-b border-amber-500/20">
                                        <p className="text-xs text-amber-200/80 font-medium">Aksi Tersedia</p>
                                    </div>

                                    {/* ✅ Switch Hak Akses Options (jika ada lebih dari 1 hak akses) */}
                                    {getAvailableHakAkses().length > 0 && (
                                        <>
                                            <div className="px-4 py-2">
                                                <p className="text-xs text-amber-300 font-semibold mb-2">Ganti Hak Akses:</p>
                                                {getAvailableHakAkses().map((hakAkses) => (
                                                    <button
                                                        key={hakAkses.m_hak_akses_id}
                                                        onClick={() => handleSwitchHakAkses(hakAkses.m_hak_akses_id, hakAkses.hak_akses_nama)}
                                                        disabled={loadingSwitch}
                                                        className="w-full text-left px-3 py-2 text-sm text-amber-100 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-yellow-600/10 rounded-lg transition-all duration-200 flex items-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <div className="w-2 h-2 bg-amber-400 rounded-full group-hover:bg-yellow-400 transition-colors duration-200"></div>
                                                        <span className="font-medium">{hakAkses.hak_akses_nama}</span>
                                                        <svg className="w-3 h-3 ml-auto text-amber-400 group-hover:text-yellow-400 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="border-t border-amber-500/20"></div>
                                        </>
                                    )}

                                    {/* ✅ Logout Button */}
                                    <div className="p-2">
                                        <button 
                                            onClick={handleLogout}
                                            disabled={loadingSwitch}
                                            className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-lg transition-all duration-200 flex items-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="font-medium">Keluar</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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

            {notification.type === 'logout' && (
                <LogoutMessage
                    message={notification.message}
                    title={notification.title}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                    onConfirm={notification.onConfirm}
                    userName={notification.userName}
                />
            )}
        </>
    );
};

export default Header;