import React, { useState, useEffect } from 'react';

const PilihLevel = () => {
    const [hakAkses, setHakAkses] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchHakAkses();
    }, []);

    const fetchHakAkses = async () => {
        setFetchLoading(true);
        try {
            const response = await axios.get('/api/hak-akses-user');
            console.log('Response hak akses:', response.data);
            
            if (Array.isArray(response.data) && response.data.length > 0) {
                setHakAkses(response.data);
            } else {
                console.error('Data hak akses kosong atau format salah');
                alert('Tidak ada hak akses yang tersedia. Silakan login ulang.');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error mengambil hak akses:', error);
            if (error.response?.status === 401) {
                alert('Session expired. Silakan login ulang.');
                window.location.href = '/login';
            } else {
                alert('Gagal mengambil data hak akses. Silakan login ulang.');
                window.location.href = '/login';
            }
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedLevel) {
            alert('Silakan pilih level hak akses!');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/set-hak-akses', {
                hak_akses_id: selectedLevel
            });

            if (response.data.success) {
                alert(response.data.message);
                window.location.href = '/dashboard';
            } else {
                alert(response.data.message || 'Gagal memilih hak akses');
            }
        } catch (error) {
            console.error('Error setting hak akses:', error);
            if (error.response?.status === 401) {
                alert('Session expired. Silakan login ulang.');
                window.location.href = '/login';
            } else {
                alert('Terjadi kesalahan saat memilih hak akses');
            }
        }
        
        setLoading(false);
    };

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            window.location.href = '/logout';
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background dengan gradasi emas-hitam */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-amber-900"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/10 to-yellow-400/20"></div>
                
                {/* Animated background elements */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-l from-amber-500/15 to-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="text-center relative z-10">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/30 animate-spin">
                        <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <p className="mt-6 text-xl font-semibold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                        Memuat data hak akses...
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background dengan gradasi emas-hitam dan animasi */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-amber-900"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/10 to-yellow-400/20"></div>
            
            {/* Animated background elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-l from-amber-500/15 to-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400/10 to-amber-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>

            <div className="max-w-lg w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/30">
                        <svg className="h-10 w-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                        Pilih Level Akses
                    </h2>
                    <p className="mt-3 text-sm text-amber-100/80 font-medium">
                        Anda memiliki <span className="text-amber-300 font-bold">{hakAkses.length}</span> level akses. Silakan pilih level yang ingin digunakan.
                    </p>
                </div>

                {/* Form Pilih Level */}
                <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 p-8 border border-amber-500/20 ring-1 ring-amber-400/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-amber-300 mb-4">
                                Level Hak Akses Tersedia:
                            </label>
                            <div className="space-y-3">
                                {hakAkses.map((item) => (
                                    <div key={item.m_hak_akses_id} className="relative group">
                                        <div className={`flex items-center p-4 border rounded-xl transition-all duration-300 cursor-pointer ${
                                            selectedLevel == item.m_hak_akses_id 
                                                ? 'border-amber-500 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 shadow-lg shadow-amber-500/25' 
                                                : 'border-amber-500/30 bg-gray-800/50 hover:border-amber-400/50 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-yellow-600/10'
                                        }`}>
                                            <input
                                                id={`level-${item.m_hak_akses_id}`}
                                                name="level"
                                                type="radio"
                                                value={item.m_hak_akses_id}
                                                checked={selectedLevel == item.m_hak_akses_id}
                                                onChange={(e) => setSelectedLevel(e.target.value)}
                                                className="h-4 w-4 text-amber-500 focus:ring-amber-500 focus:ring-2 border-amber-400 bg-gray-800"
                                            />
                                            <label 
                                                htmlFor={`level-${item.m_hak_akses_id}`} 
                                                className="ml-4 flex-1 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <span className={`text-sm font-semibold ${
                                                            selectedLevel == item.m_hak_akses_id 
                                                                ? 'text-amber-200' 
                                                                : 'text-amber-100 group-hover:text-amber-200'
                                                        }`}>
                                                            {item.hak_akses_nama}
                                                        </span>
                                                        <p className={`text-xs mt-1 ${
                                                            selectedLevel == item.m_hak_akses_id 
                                                                ? 'text-amber-300/80' 
                                                                : 'text-amber-400/60 group-hover:text-amber-300/80'
                                                        }`}>
                                                            Kode: {item.hak_akses_kode}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4">
                                                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                                            selectedLevel == item.m_hak_akses_id
                                                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg'
                                                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        }`}>
                                                            {item.hak_akses_kode}
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            {/* Checkmark icon untuk item yang dipilih */}
                                            {selectedLevel == item.m_hak_akses_id && (
                                                <div className="ml-3">
                                                    <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex-1 py-4 px-6 border border-amber-500/30 rounded-xl text-sm font-semibold text-amber-200 bg-gray-800/50 hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Keluar</span>
                                </div>
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedLevel}
                                className="flex-1 py-4 px-6 border border-transparent text-sm font-bold rounded-xl text-black bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-bold">Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="h-4 w-4 text-black/80" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="font-bold tracking-wide">LANJUTKAN</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-amber-500/30" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gradient-to-r from-transparent via-gray-900 to-transparent text-amber-300/80 font-medium">
                                Password Manager v1.0
                            </span>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-amber-200/60 font-medium">
                        © 2025 Password Manager. Semua hak dilindungi undang-undang.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PilihLevel;