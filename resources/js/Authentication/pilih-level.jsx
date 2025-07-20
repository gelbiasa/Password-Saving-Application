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
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-white text-lg">Memuat data hak akses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Pilih Level Akses
                    </h2>
                    <p className="mt-2 text-sm text-indigo-100">
                        Anda memiliki {hakAkses.length} level akses. Silakan pilih level yang ingin digunakan.
                    </p>
                </div>

                {/* Form Pilih Level */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Level Hak Akses Tersedia:
                            </label>
                            <div className="space-y-3">
                                {hakAkses.map((item) => (
                                    <div key={item.m_hak_akses_id} className="relative">
                                        <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <input
                                                id={`level-${item.m_hak_akses_id}`}
                                                name="level"
                                                type="radio"
                                                value={item.m_hak_akses_id}
                                                checked={selectedLevel == item.m_hak_akses_id}
                                                onChange={(e) => setSelectedLevel(e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label 
                                                htmlFor={`level-${item.m_hak_akses_id}`} 
                                                className="ml-3 flex-1 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.hak_akses_nama}
                                                        </span>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Kode: {item.hak_akses_kode}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                                        {item.hak_akses_kode}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Keluar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedLevel}
                                className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    'Lanjutkan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-sm text-indigo-100">
                        © 2025 Password Manager. Semua hak dilindungi undang-undang.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PilihLevel;