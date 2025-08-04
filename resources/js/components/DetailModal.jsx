import React from 'react';

const DetailModal = ({ 
    isVisible, 
    onClose, 
    data, 
    title = "Detail Data"
}) => {
    if (!isVisible || !data) return null;

    // Function untuk menghitung durasi sejak dibuat
    const getTimeSinceCreated = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMs = now - created;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours === 0) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return `${diffInMinutes} menit yang lalu`;
            }
            return `${diffInHours} jam yang lalu`;
        } else if (diffInDays === 1) {
            return 'Kemarin';
        } else if (diffInDays < 7) {
            return `${diffInDays} hari yang lalu`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} minggu yang lalu`;
        } else {
            const months = Math.floor(diffInDays / 30);
            return `${months} bulan yang lalu`;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-amber-500/20 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 p-6 border-b border-amber-500/20 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                    {title}
                                </h3>
                                <p className="text-amber-200/60 text-xs">
                                    Dibuat {getTimeSinceCreated(data.created_at)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-amber-400 hover:text-amber-300 transition-colors duration-200 p-2 rounded-full hover:bg-amber-500/10 group"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 text-sm font-medium">Kategori Aktif</span>
                        </div>
                    </div>

                    {/* Informasi Utama */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl p-4 border border-amber-500/20">
                            <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                Informasi Kategori
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center py-2 border-b border-amber-500/10">
                                    <span className="text-amber-200/80 text-sm">Kode Kategori:</span>
                                    <span className="text-amber-100 font-mono bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-3 py-1 rounded-lg text-sm font-medium border border-amber-500/20">
                                        {data.kp_kode}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-amber-500/10">
                                    <span className="text-amber-200/80 text-sm">Nama Kategori:</span>
                                    <span className="text-amber-100 font-medium text-sm">
                                        {data.kp_nama}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-amber-200/80 text-sm">ID Kategori:</span>
                                    <span className="text-amber-300/70 font-mono text-xs bg-gray-800/30 px-2 py-1 rounded">
                                        #{data.m_kategori_password_id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Waktu */}
                        <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-4 border border-blue-500/20">
                            <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                </svg>
                                Riwayat Waktu
                            </h4>
                            <div className="space-y-3">
                                <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-500/10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-blue-200 text-sm font-medium">Tanggal Dibuat</div>
                                            <div className="text-blue-100 text-xs mt-1">
                                                {new Date(data.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-blue-300 text-xs bg-blue-900/20 px-2 py-1 rounded">
                                                {new Date(data.created_at).toLocaleTimeString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {data.updated_at && data.updated_at !== data.created_at && (
                                    <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-500/10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-blue-200 text-sm font-medium">Terakhir Diubah</div>
                                                <div className="text-blue-100 text-xs mt-1">
                                                    {new Date(data.updated_at).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-blue-300 text-xs bg-blue-900/20 px-2 py-1 rounded">
                                                    {new Date(data.updated_at).toLocaleTimeString('id-ID')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistik */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-4 border border-purple-500/20">
                            <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                                </svg>
                                Statistik Penggunaan
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-purple-900/10 rounded-lg p-3 text-center border border-purple-500/10">
                                    <div className="text-purple-300 text-lg font-bold">0</div>
                                    <div className="text-purple-200/80 text-xs">Password</div>
                                </div>
                                <div className="bg-purple-900/10 rounded-lg p-3 text-center border border-purple-500/10">
                                    <div className="text-purple-300 text-lg font-bold">{getTimeSinceCreated(data.created_at).split(' ')[0]}</div>
                                    <div className="text-purple-200/80 text-xs">Usia</div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Sistem */}
                        {(data.created_by || data.updated_by) && (
                            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-500/20">
                                <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                    Informasi Sistem
                                </h4>
                                <div className="space-y-2">
                                    {data.created_by && (
                                        <div className="flex justify-between items-center py-2 border-b border-green-500/10">
                                            <span className="text-green-200/80 text-sm">Dibuat Oleh:</span>
                                            <span className="text-green-100 text-sm font-medium bg-green-900/20 px-2 py-1 rounded">
                                                User #{data.created_by}
                                            </span>
                                        </div>
                                    )}
                                    {data.updated_by && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-green-200/80 text-sm">Diubah Oleh:</span>
                                            <span className="text-green-100 text-sm font-medium bg-green-900/20 px-2 py-1 rounded">
                                                User #{data.updated_by}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 p-6 border-t border-amber-500/20 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Tutup</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;