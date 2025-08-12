<?php

namespace App\Http\Controllers\Api;

use App\Models\ManagePengguna\UserModel;
use App\Models\ManagementPassword\KategoriPasswordModel;
use App\Models\ManagementPassword\DetailPasswordModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        $data = [
            'totalPasswords' => 25,
            'weakPasswords' => 3,
            'strongPasswords' => 22
        ];
        
        return response()->json($data);
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