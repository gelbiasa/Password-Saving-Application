import React, { useState, useEffect } from 'react';
import Header from '../../../Components/Header';
import Sidebar from '../../../Components/Sidebar';
import Footer from '../../../Components/Footer';
import SuccessMessage from '../../../Feedback-Message/success';
import ErrorMessage from '../../../Feedback-Message/error';
import DeleteMessage from '../../../Feedback-Message/delete';
import CreateButton from '../../../button/create';
import UpdateButton from '../../../button/update';
import ShowButton from '../../../button/show';
import DeleteButton from '../../../button/delete';
import { useNotification } from '../../../Hooks/useNotification';

const KategoriPasswordIndex = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [formData, setFormData] = useState({
        kp_kode: '',
        kp_nama: ''
    });

    // Use notification hook
    const { notification, showSuccess, showError, showDelete, hideNotification } = useNotification();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/kategori-password');

            // Check if response is successful
            if (response.status === 200) {
                // Handle different response structures
                let responseData;
                if (response.data.success) {
                    responseData = response.data.data || [];
                } else if (Array.isArray(response.data)) {
                    responseData = response.data;
                } else {
                    responseData = [];
                }

                setData(responseData);

            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Kesalahan saat mengambil data:', error);

            // Determine error message based on error type
            let errorMessage = 'Gagal memuat data kategori password.';

            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            } else if (error.response) {
                // Server responded with error status
                errorMessage = `Server Error ${error.response.status}: ${error.response.data?.message || 'Terjadi kesalahan pada server.'}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Server tidak merespons. Silakan coba lagi nanti.';
            }

            showError(
                errorMessage + ' Menggunakan data contoh.',
                'Gagal Memuat Data',
                () => fetchData() // Retry function
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form
        if (!formData.kp_kode.trim() || !formData.kp_nama.trim()) {
            showError('Semua field harus diisi!', 'Validasi Gagal');
            return;
        }

        setSaveLoading(true);

        try {
            let response;
            const payload = {
                kp_kode: formData.kp_kode.trim(),
                kp_nama: formData.kp_nama.trim()
            };

            if (isEdit) {
                response = await axios.put(`/api/kategori-password/${editId}`, payload);
            } else {
                response = await axios.post('/api/kategori-password', payload);
            }

            if (response.data.success) {
                // Success feedback
                showSuccess(
                    `Kategori "${formData.kp_nama}" berhasil ${isEdit ? 'diperbarui' : 'disimpan'}!`,
                    `${isEdit ? 'Update' : 'Simpan'} Berhasil!`
                );

                // Reset form and close modal
                handleCloseModal();

                // Refresh data
                setTimeout(() => {
                    fetchData();
                }, 1000);
            } else {
                throw new Error(response.data.message || 'Operasi gagal');
            }
        } catch (error) {
            console.error('Kesalahan saat menyimpan data:', error);

            // Error feedback with retry option
            const errorMessage = error.response?.data?.message ||
                `Gagal ${isEdit ? 'memperbarui' : 'menyimpan'} data kategori password. Silakan coba lagi.`;

            showError(
                errorMessage,
                `${isEdit ? 'Update' : 'Simpan'} Gagal!`,
                () => handleSubmit(e) // Retry function
            );
        }

        setSaveLoading(false);
    };

    const handleEdit = (item) => {
        setFormData({
            kp_kode: item.kp_kode,
            kp_nama: item.kp_nama
        });
        setEditId(item.m_kategori_password_id);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDelete = (item) => {
        // Show delete confirmation with item details
        showDelete(
            'Data kategori password yang dihapus tidak dapat dikembalikan dan akan mempengaruhi semua password yang menggunakan kategori ini!',
            'Konfirmasi Hapus Kategori',
            () => performDelete(item.m_kategori_password_id), // Confirm action
            `${item.kp_nama} (${item.kp_kode})` // Item name
        );
    };

    const performDelete = async (id) => {
        try {
            // Show processing message
            showSuccess('Sedang menghapus data...', 'Memproses...');

            const response = await axios.delete(`/api/kategori-password/${id}`);

            if (response.data.success) {
                // Success message
                showSuccess(
                    'Kategori password berhasil dihapus!',
                    'Hapus Berhasil!'
                );

                // Refresh data
                setTimeout(() => {
                    fetchData();
                }, 1000);
            } else {
                throw new Error(response.data.message || 'Gagal menghapus data');
            }
        } catch (error) {
            console.error('Kesalahan saat menghapus data:', error);

            // Error feedback with retry option
            const errorMessage = error.response?.data?.message ||
                'Gagal menghapus data kategori password. Silakan coba lagi.';

            showError(
                errorMessage,
                'Hapus Gagal!',
                () => performDelete(id) // Retry function
            );
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ kp_kode: '', kp_nama: '' });
        setIsEdit(false);
        setEditId(null);
        setSaveLoading(false);
    };

    const handleShowDetail = (item) => {
        showSuccess(
            `Kode: ${item.kp_kode}\nNama: ${item.kp_nama}\nDibuat: ${new Date(item.created_at).toLocaleDateString('id-ID')}`,
            `Detail ${item.kp_nama}`
        );
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar activeMenu="kategori-password" />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 p-4 relative">
                    <div className="space-y-4 max-w-7xl">
                        {/* Header Halaman */}
                        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl p-6 border border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                        Kategori Password
                                    </h1>
                                    <p className="text-amber-100/80 mt-2 text-sm">
                                        Kelola kategori untuk mengorganisir password Anda dengan mudah dan terstruktur.
                                    </p>
                                </div>
                                <CreateButton
                                    text="Tambah Kategori"
                                    onClick={() => setShowModal(true)}
                                    size="medium"
                                />
                            </div>
                        </div>

                        {/* Tabel Data */}
                        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/20">
                            <div className="p-6 border-b border-amber-500/20">
                                <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                    Daftar Kategori ({data.length} kategori)
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-amber-500/20">
                                    <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">No</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Kode</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Nama Kategori</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Tanggal Dibuat</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-amber-300 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-500/10">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-spin flex items-center justify-center">
                                                            <div className="w-3 h-3 bg-black rounded-full"></div>
                                                        </div>
                                                        <span className="text-amber-200">Memuat data...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : data.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center">
                                                    <div className="text-amber-300/60">
                                                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                                        </svg>
                                                        <p>Belum ada kategori password yang dibuat</p>
                                                        <p className="text-xs mt-1">Klik tombol "Tambah Kategori" untuk mulai menambahkan</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((item, index) => (
                                                <tr key={item.m_kategori_password_id} className="hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-yellow-500/5 transition-all duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                                            {item.kp_kode}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100 font-medium">{item.kp_nama}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-200/80">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex justify-center space-x-2">
                                                            <ShowButton
                                                                size="small"
                                                                showText={false}
                                                                onClick={() => handleShowDetail(item)}
                                                            />
                                                            <UpdateButton
                                                                size="small"
                                                                showText={false}
                                                                onClick={() => handleEdit(item)}
                                                            />
                                                            <DeleteButton
                                                                size="small"
                                                                showText={false}
                                                                onClick={() => handleDelete(item)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pb-16"></div>
                    </div>

                    <Footer />
                </main>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
                    <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-amber-500/20">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                    {isEdit ? 'Edit' : 'Tambah'} Kategori Password
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-amber-400 hover:text-amber-300 transition-colors duration-200 p-1 rounded-full hover:bg-amber-500/10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">Kode Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.kp_kode}
                                        onChange={(e) => setFormData({ ...formData, kp_kode: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 transition-all duration-200"
                                        placeholder="Contoh: KP001"
                                        required
                                        disabled={saveLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.kp_nama}
                                        onChange={(e) => setFormData({ ...formData, kp_nama: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 transition-all duration-200"
                                        placeholder="Contoh: Media Sosial"
                                        required
                                        disabled={saveLoading}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={saveLoading}
                                        className="flex-1 px-6 py-3 border border-amber-500/30 rounded-xl text-amber-200 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveLoading || !formData.kp_kode.trim() || !formData.kp_nama.trim()}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                    >
                                        {saveLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Menyimpan...</span>
                                            </div>
                                        ) : (
                                            <span>{isEdit ? 'Perbarui' : 'Simpan'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Components */}
            {notification && notification.type === 'success' && (
                <SuccessMessage
                    message={notification.message}
                    title={notification.title}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                />
            )}

            {notification && notification.type === 'error' && (
                <ErrorMessage
                    message={notification.message}
                    title={notification.title}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                    onRetry={notification.onRetry}
                />
            )}

            {notification && notification.type === 'delete' && (
                <DeleteMessage
                    message={notification.message}
                    title={notification.title}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                    onConfirm={notification.onConfirm}
                    itemName={notification.itemName}
                />
            )}
        </div>
    );
};

export default KategoriPasswordIndex;