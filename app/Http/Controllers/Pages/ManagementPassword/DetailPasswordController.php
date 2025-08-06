<?php

namespace App\Http\Controllers\Pages\ManagementPassword;

use App\Http\Controllers\TraitsController;
use App\Models\ManagementPassword\DetailPasswordModel;
use App\Models\ManagementPassword\KategoriPasswordModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DetailPasswordController extends Controller
{
    use TraitsController;
    protected $model;
    protected $kategoriModel;

    public function __construct()
    {
        $this->model = new DetailPasswordModel();
        $this->kategoriModel = new KategoriPasswordModel();
    }

    /**
     * Display detail password index page
     */
    public function index()
    {
        return view('Pages.ManagementPassword.DetailPassword.index');
    }

    /**
     * Get all detail passwords
     */
    public function getData(Request $request)
    {
        try {
            $userId = $request->get('user_id'); // Optional filter by user
            $data = $this->model->getAllData($userId);
            
            return response()->json([
                'success' => true,
                'message' => 'Data berhasil dimuat',
                'data' => $data,
                'total' => $data->count()
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error fetching detail password data: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ], 500);
        }
    }

    /**
     * Get deleted detail passwords
     */
    public function getDeletedData(Request $request)
    {
        try {
            $userId = $request->get('user_id'); // Optional filter by user
            $data = $this->model->getDeletedData($userId);
            
            return response()->json([
                'success' => true,
                'message' => 'Data terhapus berhasil dimuat',
                'data' => $data,
                'total' => $data->count()
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error fetching deleted detail password data: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data terhapus: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ], 500);
        }
    }

    /**
     * Get detail password by ID
     */
    public function show($id)
    {
        try {
            $data = $this->model->getById($id, true); // With decryption
            
            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Data berhasil dimuat',
                'data' => $data
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error fetching detail password by ID: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new detail password
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fk_m_kategori_password' => 'required|integer|exists:m_kategori_password,m_kategori_password_id',
                'fk_m_user' => 'required|integer|exists:m_user,m_user_id',
                'dp_nama_username' => 'required|string|max:255',
                'dp_nama_password' => 'required|string|max:255',
                'dp_pin' => 'required|numeric|digits_between:4,10', // ✅ Validasi PIN: numeric, 4-10 digit
                'dp_keterangan' => 'required|string|max:255'
            ], [
                'fk_m_kategori_password.required' => 'Kategori password harus dipilih',
                'fk_m_kategori_password.exists' => 'Kategori password tidak valid',
                'fk_m_user.required' => 'User harus dipilih',
                'fk_m_user.exists' => 'User tidak valid',
                'dp_nama_username.required' => 'Username harus diisi',
                'dp_nama_username.max' => 'Username maksimal 255 karakter',
                'dp_nama_password.required' => 'Password harus diisi',
                'dp_nama_password.max' => 'Password maksimal 255 karakter',
                'dp_pin.required' => 'PIN harus diisi',
                'dp_pin.numeric' => 'PIN harus berupa angka',
                'dp_pin.digits_between' => 'PIN harus terdiri dari 4-10 digit',
                'dp_keterangan.required' => 'Keterangan harus diisi',
                'dp_keterangan.max' => 'Keterangan maksimal 255 karakter'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $result = $this->model->createData($request->all());
            
            if ($result['success']) {
                return response()->json($result, 201);
            } else {
                return response()->json($result, 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Error creating detail password: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update detail password
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fk_m_kategori_password' => 'required|integer|exists:m_kategori_password,m_kategori_password_id',
                'fk_m_user' => 'required|integer|exists:m_user,m_user_id',
                'dp_nama_username' => 'required|string|max:255',
                'dp_nama_password' => 'required|string|max:255',
                'dp_pin' => 'nullable|numeric|digits_between:4,10', // ✅ PIN optional saat update
                'dp_keterangan' => 'required|string|max:255'
            ], [
                'fk_m_kategori_password.required' => 'Kategori password harus dipilih',
                'fk_m_kategori_password.exists' => 'Kategori password tidak valid',
                'fk_m_user.required' => 'User harus dipilih',
                'fk_m_user.exists' => 'User tidak valid',
                'dp_nama_username.required' => 'Username harus diisi',
                'dp_nama_username.max' => 'Username maksimal 255 karakter',
                'dp_nama_password.required' => 'Password harus diisi',
                'dp_nama_password.max' => 'Password maksimal 255 karakter',
                'dp_pin.numeric' => 'PIN harus berupa angka',
                'dp_pin.digits_between' => 'PIN harus terdiri dari 4-10 digit',
                'dp_keterangan.required' => 'Keterangan harus diisi',
                'dp_keterangan.max' => 'Keterangan maksimal 255 karakter'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // ✅ Jika PIN tidak diisi saat update, hapus dari data
            $updateData = $request->all();
            if (empty($updateData['dp_pin'])) {
                unset($updateData['dp_pin']);
            }

            $result = $this->model->updateData($id, $updateData);
            
            if ($result['success']) {
                return response()->json($result, 200);
            } else {
                return response()->json($result, 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Error updating detail password: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Method baru untuk verifikasi PIN
     */
    public function verifyPin(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'pin' => 'required|numeric'
            ], [
                'pin.required' => 'PIN harus diisi',
                'pin.numeric' => 'PIN harus berupa angka'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'PIN tidak valid',
                    'errors' => $validator->errors()
                ], 422);
            }

            $detailPassword = $this->model->where('m_detail_password_id', $id)
                                         ->where('isDeleted', 0)
                                         ->first();

            if (!$detailPassword) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan'
                ], 404);
            }

            $pinValid = $detailPassword->verifyPin($request->pin);

            return response()->json([
                'success' => true,
                'pin_valid' => $pinValid,
                'message' => $pinValid ? 'PIN valid' : 'PIN tidak valid'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error verifying PIN: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memverifikasi PIN: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete detail password
     */
    public function destroy($id)
    {
        try {
            $result = $this->model->deleteData($id);
            
            if ($result['success']) {
                return response()->json($result, 200);
            } else {
                return response()->json($result, 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Error deleting detail password: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore detail password
     */
    public function restore($id)
    {
        try {
            $result = $this->model->restoreData($id);
            
            if ($result['success']) {
                return response()->json($result, 200);
            } else {
                return response()->json($result, 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Error restoring detail password: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memulihkan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get count of detail passwords
     */
    public function getCount(Request $request)
    {
        try {
            $userId = $request->get('user_id');
            $count = $this->model->getCount($userId);
            
            return response()->json([
                'success' => true,
                'count' => $count
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error getting detail password count: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'count' => 0,
                'message' => 'Gagal mengambil jumlah detail password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search detail passwords
     */
    public function search(Request $request)
    {
        try {
            $keyword = $request->get('keyword', '');
            $userId = $request->get('user_id');
            
            $data = $this->model->searchData($keyword, $userId);
            
            return response()->json([
                'success' => true,
                'message' => 'Pencarian berhasil',
                'data' => $data,
                'total' => $data->count()
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error searching detail passwords: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan pencarian: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ], 500);
        }
    }

    /**
     * Get kategori password options for select
     */
    public function getKategoriOptions()
    {
        try {
            $kategori = $this->kategoriModel->where('isDeleted', 0)
                                          ->orderBy('kp_nama', 'asc')
                                          ->get(['m_kategori_password_id', 'kp_kode', 'kp_nama']);
            
            return response()->json([
                'success' => true,
                'data' => $kategori
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error getting kategori options: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data kategori: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Get user options for select (optional, jika diperlukan)
     */
    public function getUserOptions()
    {
        try {
            $users = \App\Models\ManagePengguna\UserModel::where('isDeleted', 0)
                                                       ->orderBy('nama_pengguna', 'asc')
                                                       ->get(['m_user_id', 'username', 'nama_pengguna']);
            
            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error getting user options: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data user: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }
}