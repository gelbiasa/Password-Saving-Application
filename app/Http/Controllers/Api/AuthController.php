<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\TraitsController;
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
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $user = Auth::user();
            $selectedHakAkses = Session::get('selected_hak_akses');

            // ✅ Fix foto profil URL - handle storage link dengan benar
            $fotoProfile = asset('storage/foto-profile/default-picture.jpg'); // Default dengan asset() helper
            
            if (!empty($user->foto_profil) && $user->foto_profil !== null && $user->foto_profil !== 'NULL') {
                // Jika ada foto profil dan bukan NULL, gunakan foto tersebut
                // Check apakah file exists di storage
                if (Storage::disk('public')->exists('foto-profile/' . $user->foto_profil)) {
                    $fotoProfile = asset('storage/foto-profile/' . $user->foto_profil);
                } else {
                    // File tidak ada, gunakan default
                    Log::warning('Foto profil tidak ditemukan: ' . $user->foto_profil . ' untuk user ID: ' . $user->m_user_id);
                    $fotoProfile = asset('storage/foto-profile/default-picture.jpg');
                }
            }

            return response()->json([
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
            ]);

        } catch (\Exception $e) {
            Log::error('Error dalam getCurrentUser: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}