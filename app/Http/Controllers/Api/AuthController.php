<?php
// filepath: c:\xampp\htdocs\Password-Saving-Application\app\Http\Controllers\Api\AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\TraitsController;
use App\Models\ManagePengguna\UserModel;
use App\Models\ManagePengguna\HakAksesModel;
use App\Models\ManagePengguna\SetUserHakAksesModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    use TraitsController;
    
    public function getHakAksesUser()
    {
        try {
            // Cek apakah user sudah login
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            // Ambil hak akses dari session yang sudah disimpan saat login
            $hakAkses = Session::get('available_hak_akses');
            
            Log::info('Hak akses dari session:', ['hak_akses' => $hakAkses]);

            if (!$hakAkses || empty($hakAkses)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data hak akses tidak ditemukan di session'
                ], 404);
            }

            return response()->json($hakAkses);

        } catch (\Exception $e) {
            Log::error('Error dalam getHakAksesUser: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function setHakAkses(Request $request)
    {
        try {
            $request->validate([
                'hak_akses_id' => 'required|integer'
            ]);

            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session expired, silakan login kembali!'
                ], 401);
            }

            $hakAksesArray = Session::get('available_hak_akses');
            if (!$hakAksesArray) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data hak akses tidak ditemukan!'
                ], 404);
            }

            // Cari hak akses yang dipilih
            $selectedHakAkses = collect($hakAksesArray)->where('m_hak_akses_id', $request->input('hak_akses_id'))->first();
            
            if (!$selectedHakAkses) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hak akses tidak valid!'
                ], 400);
            }

            // Set hak akses yang dipilih ke session
            Session::put('selected_hak_akses', $selectedHakAkses);
            Session::forget('available_hak_akses');

            Log::info('Hak akses berhasil dipilih:', $selectedHakAkses);

            return response()->json([
                'success' => true,
                'message' => 'Hak akses berhasil dipilih!',
                'data' => $selectedHakAkses
            ]);

        } catch (\Exception $e) {
            Log::error('Error dalam setHakAkses: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Update getCurrentUser - Fix storage link path untuk foto profile
     */
    public function getCurrentUser()
    {
        try {
            Log::info('=== getCurrentUser API called ===');
            
            if (!Auth::check()) {
                Log::warning('User not authenticated');
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $user = Auth::user();
            $selectedHakAkses = Session::get('selected_hak_akses');

            // ✅ Debug user data
            Log::info('User data:', [
                'user_id' => $user->m_user_id ?? 'N/A',
                'nama_pengguna' => $user->nama_pengguna ?? 'N/A',
                'foto_profil_raw' => $user->foto_profil,
            ]);

            // ✅ Force default untuk testing
            $fotoProfile = asset('storage/foto-profile/default-picture.jpg');
            Log::info('Default foto profile URL: ' . $fotoProfile);

            $responseData = [
                'success' => true,
                'data' => [
                    'nama_pengguna' => $user->nama_pengguna,
                    'email_pengguna' => $user->email_pengguna,
                    'foto_profil' => $fotoProfile,
                    'username' => $user->username,
                    'hak_akses' => $selectedHakAkses ? [
                        'kode' => $selectedHakAkses['hak_akses_kode'],
                        'nama' => $selectedHakAkses['hak_akses_nama']
                    ] : null
                ]
            ];

            Log::info('Response data:', $responseData);
            
            return response()->json($responseData);

        } catch (\Exception $e) {
            Log::error('Error dalam getCurrentUser: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Fixed method untuk switching hak akses
     */
    public function switchHakAkses(Request $request)
    {
        try {
            $request->validate([
                'hak_akses_id' => 'required|integer'
            ]);

            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $user = Auth::user();
            $userId = $user->m_user_id;
            
            Log::info('switchHakAkses - User ID: ' . $userId);
            Log::info('switchHakAkses - Requested hak_akses_id: ' . $request->input('hak_akses_id'));

            // ✅ Fixed: Ambil semua hak akses user menggunakan model yang tepat
            $userHakAkses = UserModel::find($userId)
                                   ->hakAkses()
                                   ->where('m_hak_akses.isDeleted', 0)
                                   ->where('set_user_hak_akses.isDeleted', 0)
                                   ->get();

            Log::info('switchHakAkses - User hak akses found: ', $userHakAkses->toArray());

            // Cari hak akses yang dipilih
            $selectedHakAkses = $userHakAkses->where('m_hak_akses_id', $request->input('hak_akses_id'))->first();
            
            if (!$selectedHakAkses) {
                Log::warning('switchHakAkses - Hak akses tidak ditemukan untuk user');
                return response()->json([
                    'success' => false,
                    'message' => 'Hak akses tidak valid atau tidak tersedia untuk user ini!'
                ], 400);
            }

            // Update session dengan hak akses yang baru
            $newHakAkses = [
                'm_hak_akses_id' => $selectedHakAkses->m_hak_akses_id,
                'hak_akses_kode' => $selectedHakAkses->hak_akses_kode,
                'hak_akses_nama' => $selectedHakAkses->hak_akses_nama
            ];

            Session::put('selected_hak_akses', $newHakAkses);

            Log::info('Hak akses berhasil diganti:', [
                'user_id' => $userId,
                'username' => $user->username,
                'new_access' => $newHakAkses
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Hak akses berhasil diubah ke: ' . $selectedHakAkses->hak_akses_nama,
                'data' => [
                    'hak_akses' => [
                        'kode' => $selectedHakAkses->hak_akses_kode,
                        'nama' => $selectedHakAkses->hak_akses_nama
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error dalam switchHakAkses: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Fixed method untuk mendapatkan semua hak akses user
     */
    public function getAllUserHakAkses()
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
            $currentHakAkses = Session::get('selected_hak_akses');
            
            Log::info('getAllUserHakAkses - User ID: ' . $userId);
            Log::info('getAllUserHakAkses - Current hak akses: ', $currentHakAkses ?? []);

            // ✅ Fixed: Ambil semua hak akses user menggunakan model yang tepat
            $userHakAkses = UserModel::find($userId)
                                   ->hakAkses()
                                   ->where('m_hak_akses.isDeleted', 0)
                                   ->where('set_user_hak_akses.isDeleted', 0)
                                   ->get();

            Log::info('getAllUserHakAkses - User hak akses found: ', $userHakAkses->toArray());

            // Format data dan tandai yang sedang aktif
            $hakAksesData = $userHakAkses->map(function($item) use ($currentHakAkses) {
                return [
                    'm_hak_akses_id' => $item->m_hak_akses_id,
                    'hak_akses_kode' => $item->hak_akses_kode,
                    'hak_akses_nama' => $item->hak_akses_nama,
                    'is_current' => $currentHakAkses && $currentHakAkses['m_hak_akses_id'] == $item->m_hak_akses_id
                ];
            });

            Log::info('getAllUserHakAkses - Formatted data: ', $hakAksesData->toArray());

            return response()->json([
                'success' => true,
                'data' => [
                    'hak_akses_list' => $hakAksesData,
                    'current_hak_akses' => $currentHakAkses,
                    'total' => $hakAksesData->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error dalam getAllUserHakAkses: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}