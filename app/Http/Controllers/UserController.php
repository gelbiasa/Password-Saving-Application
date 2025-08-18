<?php

namespace App\Http\Controllers\Pages\ManagePengguna;

use App\Http\Controllers\TraitsController;
use App\Models\ManagePengguna\UserModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    use TraitsController;
    
    protected $model;

    public function __construct()
    {
        $this->model = new UserModel();
    }

    /**
     * Display manage user index page
     */
    public function index()
    {
        return view('Pages.ManagePengguna.User.index');
    }

    /**
     * ✅ GET ALL USERS - API endpoint untuk mengambil semua user
     */
    public function getData(Request $request)
    {
        try {
            $result = $this->model->getAllUsersWithHakAkses();
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Data user berhasil dimuat',
                    'data' => $result['data'],
                    'total' => $result['total']
                ], 200);
            } else {
                return response()->json($result, 500);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController getData: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data user: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ], 500);
        }
    }

    /**
     * ✅ GET BLOCKED USERS - API endpoint untuk mengambil user yang diblokir
     */
    public function getBlockedUsers()
    {
        try {
            $result = $this->model->getBlockedUsers();
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Data user yang diblokir berhasil dimuat',
                    'data' => $result['data'],
                    'total' => $result['total']
                ], 200);
            } else {
                return response()->json($result, 500);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController getBlockedUsers: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data user yang diblokir: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ], 500);
        }
    }

    /**
     * ✅ GET USER BY ID - API endpoint untuk detail user
     */
    public function show($id)
    {
        try {
            $result = $this->model->getUserById($id);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Detail user berhasil dimuat',
                    'data' => $result['data']
                ], 200);
            } else {
                return response()->json($result, 404);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController show: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ BLOCK USER - API endpoint untuk memblokir user
     */
    public function blockUser(Request $request, $id)
    {
        try {
            // Validasi bahwa user yang melakukan aksi adalah admin
            if (!$this->isUserAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses untuk melakukan aksi ini'
                ], 403);
            }

            // Pastikan tidak memblokir diri sendiri
            if (Auth::id() == $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak dapat memblokir akun Anda sendiri'
                ], 400);
            }

            $result = $this->model->blockUser($id);
            
            if ($result['success']) {
                return response()->json($result, 200);
            } else {
                return response()->json($result, 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController blockUser: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memblokir user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ UNBLOCK USER - API endpoint untuk membuka blokir user
     */
    public function unblockUser(Request $request, $id)
    {
        try {
            // Validasi bahwa user yang melakukan aksi adalah admin
            if (!$this->isUserAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses untuk melakukan aksi ini'
                ], 403);
            }

            $result = $this->model->unblockUser($id);
            
            if ($result['success']) {
                return response()->json($result, 200);
            } else {
                return response()->json($result, 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController unblockUser: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuka blokir user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ GET USER STATISTICS - API endpoint untuk statistik user
     */
    public function getStatistics()
    {
        try {
            $result = $this->model->getUserStatistics();
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Statistik user berhasil dimuat',
                    'data' => $result['data']
                ], 200);
            } else {
                return response()->json($result, 500);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController getStatistics: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat statistik user: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * ✅ SEARCH USERS - API endpoint untuk pencarian user
     */
    public function search(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'keyword' => 'required|string|min:1|max:100'
            ], [
                'keyword.required' => 'Keyword pencarian harus diisi',
                'keyword.min' => 'Keyword pencarian minimal 1 karakter',
                'keyword.max' => 'Keyword pencarian maksimal 100 karakter'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pencarian tidak valid',
                    'errors' => $validator->errors()
                ], 422);
            }

            $keyword = $request->get('keyword');
            $result = $this->model->searchUsers($keyword);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => "Pencarian user dengan keyword '{$keyword}' berhasil",
                    'data' => $result['data'],
                    'total' => $result['total'],
                    'keyword' => $keyword
                ], 200);
            } else {
                return response()->json($result, 500);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController search: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan pencarian: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ], 500);
        }
    }

    /**
     * ✅ GET USER COUNT - API endpoint untuk count user
     */
    public function getCount()
    {
        try {
            $totalUsers = $this->model->where('isDeleted', 0)->count();
            $activeUsers = $this->model->where('isDeleted', 0)->where('isBloked', 0)->count();
            $blockedUsers = $this->model->where('isDeleted', 0)->where('isBloked', 1)->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'blocked_users' => $blockedUsers
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error getting user count: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jumlah user: ' . $e->getMessage(),
                'data' => [
                    'total_users' => 0,
                    'active_users' => 0,
                    'blocked_users' => 0
                ]
            ], 500);
        }
    }

    /**
     * ✅ GET USER HAK AKSES DETAILS - API endpoint untuk detail hak akses user
     */
    public function getHakAksesDetails($id)
    {
        try {
            $result = $this->model->getUserHakAksesDetails($id);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Detail hak akses user berhasil dimuat',
                    'data' => $result['data']
                ], 200);
            } else {
                return response()->json($result, 404);
            }
            
        } catch (\Exception $e) {
            Log::error('Error in UserController getHakAksesDetails: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail hak akses: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * ✅ Helper method - Check if current user is admin - FIXED CONSISTENT WITH AuthController
     */
    private function isUserAdmin()
    {
        try {
            $currentUser = Auth::user();
            if (!$currentUser) {
                return false;
            }

            $userId = $currentUser->m_user_id;

            // Cek dari session jika ada
            $selectedHakAkses = session('selected_hak_akses');
            if ($selectedHakAkses && $selectedHakAkses['hak_akses_kode'] === 'ADM') {
                return true;
            }

            // ✅ FIXED: Cek dari database menggunakan konsep yang sama dengan AuthController
            $userHakAkses = UserModel::find($userId)
                                   ->hakAkses()
                                   ->where('m_hak_akses.isDeleted', 0)
                                   ->where('set_user_hak_akses.isDeleted', 0)
                                   ->where('hak_akses_kode', 'ADM')
                                   ->first();

            return $userHakAkses !== null;

        } catch (\Exception $e) {
            Log::error('Error checking admin access: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * ✅ BATCH OPERATIONS - Untuk operasi batch (future enhancement)
     */
    public function batchBlock(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'integer|exists:m_user,m_user_id'
            ], [
                'user_ids.required' => 'User IDs harus diisi',
                'user_ids.array' => 'User IDs harus berupa array',
                'user_ids.min' => 'Minimal 1 user harus dipilih',
                'user_ids.*.integer' => 'User ID harus berupa angka',
                'user_ids.*.exists' => 'User tidak ditemukan'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak valid',
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!$this->isUserAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses untuk melakukan aksi ini'
                ], 403);
            }

            $userIds = $request->get('user_ids');
            $currentUserId = Auth::id();
            
            // Remove current user from list
            $userIds = array_filter($userIds, function($id) use ($currentUserId) {
                return $id != $currentUserId;
            });

            $successCount = 0;
            $failedUsers = [];

            foreach ($userIds as $userId) {
                $result = $this->model->blockUser($userId);
                if ($result['success']) {
                    $successCount++;
                } else {
                    $failedUsers[] = [
                        'user_id' => $userId,
                        'error' => $result['message']
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Berhasil memblokir {$successCount} user",
                'data' => [
                    'success_count' => $successCount,
                    'failed_count' => count($failedUsers),
                    'failed_users' => $failedUsers
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error in UserController batchBlock: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan batch block: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ BATCH UNBLOCK
     */
    public function batchUnblock(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'integer|exists:m_user,m_user_id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak valid',
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!$this->isUserAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses untuk melakukan aksi ini'
                ], 403);
            }

            $userIds = $request->get('user_ids');
            $successCount = 0;
            $failedUsers = [];

            foreach ($userIds as $userId) {
                $result = $this->model->unblockUser($userId);
                if ($result['success']) {
                    $successCount++;
                } else {
                    $failedUsers[] = [
                        'user_id' => $userId,
                        'error' => $result['message']
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Berhasil membuka blokir {$successCount} user",
                'data' => [
                    'success_count' => $successCount,
                    'failed_count' => count($failedUsers),
                    'failed_users' => $failedUsers
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error in UserController batchUnblock: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan batch unblock: ' . $e->getMessage()
            ], 500);
        }
    }
}
