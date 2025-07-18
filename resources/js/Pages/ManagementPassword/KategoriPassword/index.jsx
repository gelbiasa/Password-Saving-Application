import React, { useState, useEffect } from 'react';
import Header from '../../../Components/Header';
import Sidebar from '../../../Components/Sidebar';
import Footer from '../../../Components/Footer';

const KategoriPasswordIndex = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        kp_kode: '',
        kp_nama: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/kategori-password');
            setData(response.data);
        } catch (error) {
            console.error('Kesalahan saat mengambil data:', error);
            // Data contoh untuk pengujian
            setData([
                { m_kategori_password_id: 1, kp_kode: 'KP001', kp_nama: 'Media Sosial', created_at: '2025-01-15' },
                { m_kategori_password_id: 2, kp_kode: 'KP002', kp_nama: 'Email', created_at: '2025-01-15' },
                { m_kategori_password_id: 3, kp_kode: 'KP003', kp_nama: 'Perbankan', created_at: '2025-01-15' }
            ]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await axios.put(`/api/kategori-password/${editId}`, formData);
            } else {
                response = await axios.post('/api/kategori-password', formData);
            }
            
            if (response.data.success) {
                setShowModal(false);
                setFormData({ kp_kode: '', kp_nama: '' });
                setIsEdit(false);
                setEditId(null);
                fetchData();
                alert(isEdit ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!');
            }
        } catch (error) {
            console.error('Kesalahan saat menyimpan data:', error);
            alert('Gagal menyimpan data!');
        }
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

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                const response = await axios.delete(`/api/kategori-password/${id}`);
                if (response.data.success) {
                    fetchData();
                    alert('Data berhasil dihapus!');
                }
            } catch (error) {
                console.error('Kesalahan saat menghapus data:', error);
                alert('Gagal menghapus data!');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ kp_kode: '', kp_nama: '' });
        setIsEdit(false);
        setEditId(null);
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar activeMenu="kategori-password" />
            
            <div className="flex-1 flex flex-col">
                <Header />
                
                <main className="flex-1 p-4 relative">
                    <div className="space-y-4 max-w-7xl">
                        {/* Header Halaman */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Kategori Password</h1>
                                    <p className="text-gray-600 mt-1 text-sm">Kelola kategori untuk mengorganisir password Anda.</p>
                                </div>
                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Tambah Kategori</span>
                                </button>
                            </div>
                        </div>

                        {/* Tabel Data */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Daftar Kategori</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Memuat data...</td>
                                            </tr>
                                        ) : data.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
                                            </tr>
                                        ) : (
                                            data.map((item, index) => (
                                                <tr key={item.m_kategori_password_id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.kp_kode}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kp_nama}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button 
                                                            onClick={() => handleEdit(item)}
                                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item.m_kategori_password_id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                        >
                                                            Hapus
                                                        </button>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {isEdit ? 'Edit' : 'Tambah'} Kategori Password
                                </h3>
                                <button 
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.kp_kode}
                                        onChange={(e) => setFormData({...formData, kp_kode: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Contoh: KP001"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.kp_nama}
                                        onChange={(e) => setFormData({...formData, kp_nama: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Contoh: Media Sosial"
                                        required
                                    />
                                </div>
                                
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        {isEdit ? 'Perbarui' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KategoriPasswordIndex;