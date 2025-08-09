import React, { useState, useEffect } from 'react';
import Header from '../../../Components/Header';
import Sidebar from '../../../Components/Sidebar';
import Footer from '../../../Components/Footer';
import PasswordInput from '../../../Components/PasswordInput';
import DetailModal from '../../../Components/DetailModal'; // Tambahkan import ini
import SuccessMessage from '../../../Feedback-Message/success';
import ErrorMessage from '../../../Feedback-Message/error';
import DeleteMessage from '../../../Feedback-Message/delete';
import CreateButton from '../../../button/create';
import UpdateButton from '../../../button/update';
import ShowButton from '../../../button/show';
import DeleteButton from '../../../button/delete';
import { useNotification } from '../../../Hooks/useNotification';

const DetailPasswordIndex = () => {
    const [data, setData] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // ✅ Update formData dengan dp_pin
    const [formData, setFormData] = useState({
        fk_m_kategori_password: '',
        fk_m_user: 1,
        dp_nama_username: '',
        dp_nama_password: '',
        dp_pin: '', // ✅ Tambah field PIN
        dp_keterangan: ''
    });

    // ✅ Tambah state untuk modal detail dengan PIN verification
    const [detailModalData, setDetailModalData] = useState(null);
    const [pinVerification, setPinVerification] = useState({
        isVerifying: false,
        isVerified: false,
        showPinInput: false,
        enteredPin: '',
        error: ''
    });

    // Use notification hook
    const { notification, showSuccess, showError, showDelete, hideNotification } = useNotification();

    useEffect(() => {
        fetchData();
        fetchKategoriOptions();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/detail-password');

            if (response.status === 200) {
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

            let errorMessage = 'Gagal memuat data detail password.';
            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            } else if (error.response) {
                errorMessage = `Server Error ${error.response.status}: ${error.response.data?.message || 'Terjadi kesalahan pada server.'}`;
            } else if (error.request) {
                errorMessage = 'Server tidak merespons. Silakan coba lagi nanti.';
            }

            showError(
                errorMessage + ' Menggunakan data contoh.',
                'Gagal Memuat Data',
                () => fetchData()
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchKategoriOptions = async () => {
        try {
            const response = await axios.get('/api/detail-password/kategori-options');
            if (response.data.success) {
                setKategoriOptions(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching kategori options:', error);
            setKategoriOptions([]);
        }
    };

    // ✅ Update handleSubmit dengan validasi PIN
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Update validasi form dengan PIN
        if (!formData.fk_m_kategori_password || !formData.dp_nama_username.trim() ||
            !formData.dp_nama_password.trim() || !formData.dp_keterangan.trim() ||
            (!isEdit && !formData.dp_pin.trim())) { // PIN required untuk create, optional untuk edit
            showError('Semua field wajib harus diisi!', 'Validasi Gagal');
            return;
        }

        // ✅ Validasi panjang PIN
        if (formData.dp_pin && (formData.dp_pin.length < 4 || formData.dp_pin.length > 10)) {
            showError('PIN harus terdiri dari 4-10 digit!', 'Validasi PIN Gagal');
            return;
        }

        setSaveLoading(true);

        try {
            let response;
            const payload = {
                fk_m_kategori_password: formData.fk_m_kategori_password,
                fk_m_user: formData.fk_m_user,
                dp_nama_username: formData.dp_nama_username.trim(),
                dp_nama_password: formData.dp_nama_password.trim(),
                dp_keterangan: formData.dp_keterangan.trim()
            };

            // ✅ Tambahkan PIN ke payload jika ada
            if (formData.dp_pin && formData.dp_pin.trim()) {
                payload.dp_pin = formData.dp_pin.trim();
            }

            if (isEdit) {
                response = await axios.put(`/api/detail-password/${editId}`, payload);
            } else {
                response = await axios.post('/api/detail-password', payload);
            }

            if (response.data.success) {
                showSuccess(
                    `Detail password berhasil ${isEdit ? 'diperbarui' : 'disimpan'}!`,
                    `${isEdit ? 'Update' : 'Simpan'} Berhasil!`
                );

                handleCloseModal();

                setTimeout(() => {
                    fetchData();
                    if (window.refreshSidebarCounts) {
                        window.refreshSidebarCounts();
                    }
                }, 1000);
            } else {
                throw new Error(response.data.message || 'Operasi gagal');
            }
        } catch (error) {
            console.error('Kesalahan saat menyimpan data:', error);

            const errorMessage = error.response?.data?.message ||
                `Gagal ${isEdit ? 'memperbarui' : 'menyimpan'} detail password. Silakan coba lagi.`;

            showError(
                errorMessage,
                `${isEdit ? 'Update' : 'Simpan'} Gagal!`,
                () => handleSubmit(e)
            );
        }

        setSaveLoading(false);
    };

    // ✅ Update handleEdit dengan PIN (tidak menampilkan PIN untuk keamanan)
    const handleEdit = (item) => {
        setFormData({
            fk_m_kategori_password: item.fk_m_kategori_password,
            fk_m_user: item.fk_m_user,
            dp_nama_username: item.dp_nama_username_decrypted || '',
            dp_nama_password: item.dp_nama_password_decrypted || '',
            dp_pin: '', // ✅ PIN tidak ditampilkan saat edit untuk keamanan
            dp_keterangan: item.dp_keterangan
        });
        setEditId(item.m_detail_password_id);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDelete = (item) => {
        showDelete(
            'Data detail password yang dihapus tidak dapat dikembalikan!',
            'Konfirmasi Hapus Detail Password',
            () => performDelete(item.m_detail_password_id),
            `${item.dp_keterangan} (${item.kategori_password?.kp_nama || 'Unknown'})`
        );
    };

    const performDelete = async (id) => {
        try {
            showSuccess('Sedang menghapus data...', 'Memproses...');

            const response = await axios.delete(`/api/detail-password/${id}`);

            if (response.data.success) {
                showSuccess(
                    'Detail password berhasil dihapus!',
                    'Hapus Berhasil!'
                );

                setTimeout(() => {
                    fetchData();
                    if (window.refreshSidebarCounts) {
                        window.refreshSidebarCounts();
                    }
                }, 1000);
            } else {
                throw new Error(response.data.message || 'Gagal menghapus data');
            }
        } catch (error) {
            console.error('Kesalahan saat menghapus data:', error);

            const errorMessage = error.response?.data?.message ||
                'Gagal menghapus detail password. Silakan coba lagi.';

            showError(
                errorMessage,
                'Hapus Gagal!',
                () => performDelete(id)
            );
        }
    };

    // ✅ Update handleCloseModal dengan PIN
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            fk_m_kategori_password: '',
            fk_m_user: 1,
            dp_nama_username: '',
            dp_nama_password: '',
            dp_pin: '', // ✅ Reset PIN
            dp_keterangan: ''
        });
        setIsEdit(false);
        setEditId(null);
        setSaveLoading(false);
    };

    // Ganti handleShowDetail agar menggunakan modal
    const handleShowDetail = async (item) => {
        try {
            setSelectedItem(item);
            setDetailModalData(null);
            setPinVerification({
                isVerifying: false,
                isVerified: false,
                showPinInput: item.has_pin, // Show PIN input jika ada PIN
                enteredPin: '',
                error: ''
            });
            setShowDetailModal(true);

            // Jika tidak ada PIN, langsung fetch detail
            if (!item.has_pin) {
                await fetchDetailData(item.m_detail_password_id);
            }
        } catch (error) {
            console.error('Error showing detail:', error);
            showError('Gagal menampilkan detail data', 'Error');
        }
    };

    // ✅ Function untuk fetch detail data yang sudah di-decrypt
    const fetchDetailData = async (id) => {
        try {
            const response = await axios.get(`/api/detail-password/${id}/detail`);
            if (response.data.success) {
                setDetailModalData(response.data.data);
                setPinVerification(prev => ({ ...prev, isVerified: true }));
            } else {
                throw new Error(response.data.message || 'Gagal mengambil detail data');
            }
        } catch (error) {
            console.error('Error fetching detail data:', error);
            showError(
                error.response?.data?.message || 'Gagal mengambil detail data',
                'Error'
            );
        }
    };

    // ✅ Function untuk verifikasi PIN
    const handlePinVerification = async () => {
        if (!pinVerification.enteredPin || pinVerification.enteredPin.length < 4) {
            setPinVerification(prev => ({ 
                ...prev, 
                error: 'PIN harus minimal 4 digit' 
            }));
            return;
        }

        setPinVerification(prev => ({ ...prev, isVerifying: true, error: '' }));

        try {
            const response = await axios.post(`/api/detail-password/${selectedItem.m_detail_password_id}/verify-pin`, {
                pin: pinVerification.enteredPin
            });

            if (response.data.success && response.data.pin_valid) {
                // PIN valid, fetch detail data
                await fetchDetailData(selectedItem.m_detail_password_id);
                setPinVerification(prev => ({ 
                    ...prev, 
                    isVerifying: false, 
                    isVerified: true,
                    showPinInput: false 
                }));
            } else {
                setPinVerification(prev => ({ 
                    ...prev, 
                    isVerifying: false, 
                    error: 'PIN tidak valid' 
                }));
            }
        } catch (error) {
            console.error('Error verifying PIN:', error);
            setPinVerification(prev => ({ 
                ...prev, 
                isVerifying: false, 
                error: error.response?.data?.message || 'Gagal memverifikasi PIN' 
            }));
        }
    };

    // ✅ Function untuk handle close detail modal
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedItem(null);
        setDetailModalData(null);
        setPinVerification({
            isVerifying: false,
            isVerified: false,
            showPinInput: false,
            enteredPin: '',
            error: ''
        });
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar activeMenu="detail-password" />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 p-4 bg-gradient-to-br from-slate-100 via-blue-100 to-gray-100 relative">
                    <div className="space-y-4 max-w-7xl">
                        {/* Header Halaman */}
                        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl p-6 border border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                        Detail Password
                                    </h1>
                                    <p className="text-amber-100/80 mt-2 text-sm">
                                        Kelola dan simpan detail password Anda dengan aman menggunakan enkripsi dan PIN keamanan.
                                    </p>
                                </div>
                                <CreateButton
                                    text="Tambah Password"
                                    onClick={() => setShowModal(true)}
                                    size="medium"
                                />
                            </div>
                        </div>

                        {/* Tabel Data */}
                        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-500/20">
                            <div className="p-6 border-b border-amber-500/20">
                                <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                    Daftar Password ({data.length} password)
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-amber-500/20">
                                    <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">No</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Kategori</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Username</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Password</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">PIN</th> {/* ✅ Tambah kolom PIN */}
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Keterangan</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-wider">Tanggal Dibuat</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-amber-300 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-500/10">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center"> {/* ✅ Update colspan */}
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
                                                <td colSpan="8" className="px-6 py-8 text-center"> {/* ✅ Update colspan */}
                                                    <div className="text-amber-300/60">
                                                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                                        </svg>
                                                        <p>Belum ada detail password yang disimpan</p>
                                                        <p className="text-xs mt-1">Klik tombol "Tambah Password" untuk mulai menambahkan</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((item, index) => (
                                                <tr key={item.m_detail_password_id} className="hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-yellow-500/5 transition-all duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                                                            {item.kategori_password?.kp_nama || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-amber-100 font-mono bg-gray-800/50 px-2 py-1 rounded">
                                                            {item.dp_nama_username_masked || '***'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-amber-100 font-mono bg-gray-800/50 px-2 py-1 rounded">
                                                            {item.dp_nama_password_masked || '***'}
                                                        </span>
                                                    </td>
                                                    {/* ✅ Tambah kolom PIN */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-amber-100 font-mono bg-gray-800/50 px-2 py-1 rounded">
                                                                {item.dp_pin_masked || '****'}
                                                            </span>
                                                            {item.has_pin && (
                                                                <div className="w-2 h-2 bg-green-400 rounded-full" title="PIN telah diset"></div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">{item.dp_keterangan}</td>
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

            {/* ✅ Update Modal Form dengan PIN Input */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
                    <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-amber-500/20 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                    {isEdit ? 'Edit' : 'Tambah'} Detail Password
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
                                {/* Kategori Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                                        Kategori Password <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={formData.fk_m_kategori_password}
                                        onChange={(e) => setFormData({ ...formData, fk_m_kategori_password: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 transition-all duration-200"
                                        required
                                        disabled={saveLoading}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategoriOptions.map((kategori) => (
                                            <option key={kategori.m_kategori_password_id} value={kategori.m_kategori_password_id}>
                                                {kategori.kp_nama} ({kategori.kp_kode})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Username Input with Eye Icon */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                                        Username <span className="text-red-400">*</span>
                                    </label>
                                    <PasswordInput
                                        value={formData.dp_nama_username}
                                        onChange={(value) => setFormData({ ...formData, dp_nama_username: value })}
                                        placeholder="Masukkan username"
                                        required
                                        disabled={saveLoading}
                                        showEyeIcon={true} // ✅ Enable eye icon
                                    />
                                </div>

                                {/* Password Input with Eye Icon */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                                        Password <span className="text-red-400">*</span>
                                    </label>
                                    <PasswordInput
                                        value={formData.dp_nama_password}
                                        onChange={(value) => setFormData({ ...formData, dp_nama_password: value })}
                                        placeholder="Masukkan password"
                                        required
                                        disabled={saveLoading}
                                        showEyeIcon={true} // ✅ Enable eye icon
                                    />
                                </div>

                                {/* ✅ PIN Input with Eye Icon */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                                        PIN Keamanan 
                                        {!isEdit && <span className="text-red-400"> *</span>}
                                        <span className="text-xs text-amber-400/80 ml-2">(4-10 digit)</span>
                                    </label>
                                    <PasswordInput
                                        value={formData.dp_pin}
                                        onChange={(value) => {
                                            // Hanya izinkan angka dan batasi maksimal 10 karakter
                                            const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
                                            setFormData({ ...formData, dp_pin: numericValue });
                                        }}
                                        placeholder={isEdit ? "Biarkan kosong jika tidak ingin mengubah PIN" : "Masukkan PIN 4-10 digit"}
                                        required={!isEdit} // Required untuk create, optional untuk edit
                                        disabled={saveLoading}
                                        showEyeIcon={true} // ✅ Enable eye icon untuk PIN
                                        inputMode="numeric" // ✅ Numeric keyboard di mobile
                                        pattern="[0-9]*" // ✅ Pattern untuk numeric
                                    />
                                    <p className="text-xs text-amber-400/60 mt-1">
                                        {isEdit ? 
                                            "PIN akan di-hash untuk keamanan. Kosongkan jika tidak ingin mengubah." :
                                            "PIN akan di-hash untuk keamanan dan tidak dapat dilihat kembali."
                                        }
                                    </p>
                                </div>

                                {/* Keterangan */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-300 mb-2">
                                        Keterangan <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={formData.dp_keterangan}
                                        onChange={(e) => setFormData({ ...formData, dp_keterangan: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 transition-all duration-200 resize-none"
                                        placeholder="Contoh: Password untuk akun Gmail pribadi"
                                        rows="3"
                                        required
                                        disabled={saveLoading}
                                    />
                                </div>

                                {/* Buttons */}
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
                                        disabled={saveLoading || 
                                            !formData.fk_m_kategori_password || 
                                            !formData.dp_nama_username.trim() || 
                                            !formData.dp_nama_password.trim() || 
                                            !formData.dp_keterangan.trim() ||
                                            (!isEdit && !formData.dp_pin.trim()) ||
                                            (formData.dp_pin && (formData.dp_pin.length < 4 || formData.dp_pin.length > 10))
                                        }
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

            {/* ✅ Update Modal Detail dengan PIN Verification dan Data Decrypted */}
            {showDetailModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-amber-500/20 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                    Detail Password
                                </h3>
                                <button
                                    onClick={handleCloseDetailModal}
                                    className="text-amber-400 hover:text-amber-300 transition-colors duration-200 p-1 rounded-full hover:bg-amber-500/10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* ✅ PIN Verification Section */}
                            {pinVerification.showPinInput && !pinVerification.isVerified && (
                                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="text-amber-300 font-semibold">Verifikasi PIN Keamanan</span>
                                    </div>
                                    <p className="text-amber-200/80 text-sm mb-4">
                                        Data ini dilindungi dengan PIN keamanan. Masukkan PIN untuk melihat detail.
                                    </p>
                                    
                                    <div className="flex space-x-3">
                                        <input
                                            type="password"
                                            value={pinVerification.enteredPin}
                                            onChange={(e) => {
                                                const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                                setPinVerification(prev => ({ 
                                                    ...prev, 
                                                    enteredPin: numericValue,
                                                    error: ''
                                                }));
                                            }}
                                            placeholder="Masukkan PIN"
                                            disabled={pinVerification.isVerifying}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="flex-1 px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 transition-all duration-200"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handlePinVerification();
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={handlePinVerification}
                                            disabled={pinVerification.isVerifying || !pinVerification.enteredPin}
                                            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {pinVerification.isVerifying ? (
                                                <div className="flex items-center space-x-2">
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Verifying...</span>
                                                </div>
                                            ) : 'Verifikasi'}
                                        </button>
                                    </div>
                                    
                                    {pinVerification.error && (
                                        <p className="text-red-400 text-sm mt-2">{pinVerification.error}</p>
                                    )}
                                </div>
                            )}

                            {/* ✅ Detail Content - Show setelah PIN verified atau jika tidak ada PIN */}
                            {(pinVerification.isVerified || !selectedItem?.has_pin) && (
                                <div className="space-y-4">
                                    {detailModalData ? (
                                        <>
                                            {/* ✅ Kategori Password */}
                                            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl border border-amber-500/20">
                                                <h4 className="text-amber-300 font-semibold mb-2">Kategori Password</h4>
                                                <div className="flex items-center space-x-2">
                                                    <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent font-semibold">
                                                        {detailModalData.kategori_password?.kp_nama || 'Unknown'}
                                                    </span>
                                                    <span className="text-amber-200/60 text-sm">
                                                        ({detailModalData.kategori_password?.kp_kode || 'N/A'})
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ✅ Username (Decrypted) */}
                                            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl border border-amber-500/20">
                                                <h4 className="text-amber-300 font-semibold mb-2">Username</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono bg-gray-900/50 px-3 py-2 rounded-lg text-amber-100 break-all">
                                                        {detailModalData.dp_nama_username_decrypted || '[Error: Cannot decrypt]'}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(detailModalData.dp_nama_username_decrypted || '');
                                                            showSuccess('Username berhasil disalin!', 'Copied!');
                                                        }}
                                                        className="ml-2 p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                                                        title="Salin username"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                                                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ✅ Password (Decrypted) */}
                                            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl border border-amber-500/20">
                                                <h4 className="text-amber-300 font-semibold mb-2">Password</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono bg-gray-900/50 px-3 py-2 rounded-lg text-amber-100 break-all">
                                                        {detailModalData.dp_nama_password_decrypted || '[Error: Cannot decrypt]'}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(detailModalData.dp_nama_password_decrypted || '');
                                                            showSuccess('Password berhasil disalin!', 'Copied!');
                                                        }}
                                                        className="ml-2 p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                                                        title="Salin password"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                                                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ✅ Keterangan */}
                                            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl border border-amber-500/20">
                                                <h4 className="text-amber-300 font-semibold mb-2">Keterangan</h4>
                                                <p className="text-amber-100 leading-relaxed">
                                                    {detailModalData.dp_keterangan || '-'}
                                                </p>
                                            </div>

                                            {/* ✅ PIN Status (tanpa menampilkan PIN actual) */}
                                            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl border border-amber-500/20">
                                                <h4 className="text-amber-300 font-semibold mb-2">Keamanan PIN</h4>
                                                <div className="flex items-center space-x-2">
                                                    {detailModalData.has_pin ? (
                                                        <>
                                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                            <span className="text-green-300">PIN Aktif</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                            <span className="text-red-300">PIN Tidak Diset</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ✅ Informasi Sistem */}
                                            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl border border-amber-500/20">
                                                <h4 className="text-amber-300 font-semibold mb-3">Informasi Sistem</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-amber-200/60">ID:</span>
                                                        <span className="text-amber-100 ml-2">#{detailModalData.m_detail_password_id}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-amber-200/60">Dibuat:</span>
                                                        <span className="text-amber-100 ml-2">
                                                            {new Date(detailModalData.created_at).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-amber-200/60">Diperbarui:</span>
                                                        <span className="text-amber-100 ml-2">
                                                            {new Date(detailModalData.updated_at).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-amber-200/60">Status:</span>
                                                        <span className="text-green-300 ml-2">Aktif</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-spin flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                                </div>
                                                <span className="text-amber-200">Memuat detail data...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex justify-end pt-4 mt-6 border-t border-amber-500/20">
                                <button
                                    onClick={handleCloseDetailModal}
                                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                    Tutup
                                </button>
                            </div>
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

export default DetailPasswordIndex;