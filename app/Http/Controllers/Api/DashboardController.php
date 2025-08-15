<?php

namespace App\Http\Controllers\Api;

use App\Models\ManagePengguna\UserModel;
use App\Models\ManagementPassword\KategoriPasswordModel;
use App\Models\ManagementPassword\DetailPasswordModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class DashboardController extends Controller
{
    /**
     * ✅ Updated getDashboardData untuk user-specific data
     */
    public function getDashboardData()
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $user = Auth::user();
            $userId = $user->m_user_id;

            Log::info('getDashboardData - User ID: ' . $userId);

            // ✅ Ambil semua detail password user ini
            $userPasswords = DetailPasswordModel::where('fk_m_user', $userId)
                                               ->where('isDeleted', 0)
                                               ->get();

            Log::info('getDashboardData - Total passwords found: ' . $userPasswords->count());

            $totalPasswords = $userPasswords->count();
            $strongPasswords = 0;
            $weakPasswords = 0;

            // ✅ Analisis kekuatan password untuk setiap detail password
            foreach ($userPasswords as $passwordData) {
                try {
                    // Decrypt password untuk analisis
                    $encryptedPassword = $passwordData->getOriginal('dp_nama_password');
                    
                    if (!empty($encryptedPassword)) {
                        $decryptedPassword = Crypt::decryptString($encryptedPassword);
                        
                        if ($this->isStrongPassword($decryptedPassword)) {
                            $strongPasswords++;
                        } else {
                            $weakPasswords++;
                        }

                        Log::info('Password analyzed - Length: ' . strlen($decryptedPassword) . ', Strong: ' . ($this->isStrongPassword($decryptedPassword) ? 'Yes' : 'No'));
                    }
                } catch (\Exception $e) {
                    Log::error('Error decrypting password for analysis: ' . $e->getMessage());
                    // Jika tidak bisa decrypt, anggap sebagai weak password
                    $weakPasswords++;
                }
            }

            $data = [
                'totalPasswords' => $totalPasswords,
                'weakPasswords' => $weakPasswords,
                'strongPasswords' => $strongPasswords
            ];

            Log::info('getDashboardData - Final data:', $data);
            
            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting dashboard data: ' . $e->getMessage());
            
            // Return default fallback data
            return response()->json([
                'success' => true,
                'data' => [
                    'totalPasswords' => 0,
                    'weakPasswords' => 0,
                    'strongPasswords' => 0
                ]
            ]);
        }
    }

    /**
     * ✅ Logika untuk menentukan password kuat/lemah
     */
    private function isStrongPassword($password)
    {
        // Rule 1: Jika password lebih dari 12 karakter, otomatis kuat
        if (strlen($password) > 12) {
            Log::info('Password strong - Length > 12: ' . strlen($password));
            return true;
        }

        // Rule 2: Jika kurang dari atau sama dengan 12 karakter, 
        // harus memiliki symbol, number, dan huruf kapital
        if (strlen($password) <= 12) {
            $hasSymbol = preg_match('/[@!#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/', $password);
            $hasNumber = preg_match('/[0-9]/', $password);
            $hasUppercase = preg_match('/[A-Z]/', $password);

            $isStrong = $hasSymbol && $hasNumber && $hasUppercase;
            
            Log::info('Password analysis - Length: ' . strlen($password) . 
                     ', Symbol: ' . ($hasSymbol ? 'Yes' : 'No') . 
                     ', Number: ' . ($hasNumber ? 'Yes' : 'No') . 
                     ', Uppercase: ' . ($hasUppercase ? 'Yes' : 'No') . 
                     ', Strong: ' . ($isStrong ? 'Yes' : 'No'));

            return $isStrong;
        }

        return false;
    }

    /**
     * ✅ Method untuk testing password strength (untuk debugging)
     */
    public function testPasswordStrength(Request $request)
    {
        try {
            $request->validate([
                'password' => 'required|string'
            ]);

            $password = $request->input('password');
            $isStrong = $this->isStrongPassword($password);

            return response()->json([
                'success' => true,
                'data' => [
                    'password' => $password,
                    'length' => strlen($password),
                    'is_strong' => $isStrong,
                    'analysis' => [
                        'has_symbol' => preg_match('/[@!#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/', $password) ? true : false,
                        'has_number' => preg_match('/[0-9]/', $password) ? true : false,
                        'has_uppercase' => preg_match('/[A-Z]/', $password) ? true : false,
                        'length_over_12' => strlen($password) > 12
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getDashboardAdminData()
    {
        try {
            // Total Users
            $totalUsers = UserModel::where('isDeleted', 0)->count();
            $activeUsers = UserModel::where('isDeleted', 0)->where('isBloked', 0)->count();
            $blockedUsers = UserModel::where('isDeleted', 0)->where('isBloked', 1)->count();

            // Total Kategori Password
            $totalKategoriPassword = KategoriPasswordModel::where('isDeleted', 0)->count();

            // Total Detail Password
            $totalDetailPassword = DetailPasswordModel::where('isDeleted', 0)->count();

            // Recent Users (5 users terbaru)
            $recentUsers = UserModel::where('isDeleted', 0)
                                  ->orderBy('created_at', 'desc')
                                  ->take(5)
                                  ->get()
                                  ->map(function($user) {
                                      return [
                                          'nama' => $user->nama_pengguna,
                                          'email' => $user->email_pengguna,
                                          'last_login' => $user->updated_at ? $user->updated_at->diffForHumans() : 'Belum pernah login',
                                          'status' => $user->isBloked ? 'blocked' : 'active'
                                      ];
                                  });

            // Statistik Password per Kategori
            $userStatistics = DB::table('m_detail_password as dp')
                               ->join('m_kategori_password as kp', 'dp.fk_m_kategori_password', '=', 'kp.m_kategori_password_id')
                               ->where('dp.isDeleted', 0)
                               ->where('kp.isDeleted', 0)
                               ->select('kp.kp_nama as kategori', DB::raw('COUNT(*) as total_password'))
                               ->groupBy('kp.kp_nama')
                               ->orderBy('total_password', 'desc')
                               ->get();

            $data = [
                'totalUsers' => $totalUsers,
                'totalKategoriPassword' => $totalKategoriPassword,
                'totalDetailPassword' => $totalDetailPassword,
                'activeUsers' => $activeUsers,
                'blockedUsers' => $blockedUsers,
                'recentUsers' => $recentUsers,
                'userStatistics' => $userStatistics
            ];

            return response()->json([
                'success' => true,
                'message' => 'Data dashboard admin berhasil dimuat',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting dashboard admin data: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data dashboard admin: ' . $e->getMessage()
            ], 500);
        }
    }
}