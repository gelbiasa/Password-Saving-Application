<?php

namespace App\Http\Controllers;

use App\Models\ManagePengguna\UserModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    use TraitsController;
    // Tampilkan halaman login
    public function login()
    {
        return view('Authentication.login');
    }

    // Proses login
    public function postLogin(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            // Cari user berdasarkan username
            $user = UserModel::where('username', $request->input('username'))
                           ->where('isDeleted', 0)
                           ->first();

            // Validasi user exists dan password benar
            if (!$user || !Hash::check($request->input('password'), $user->getAttribute('password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Username atau password salah!'
                ], 401);
            }

            // Cek apakah user diblokir
            if ($user->isBlocked()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda telah diblokir. Hubungi administrator!'
                ], 403);
            }

            // Login user
            Auth::login($user);

            // Ambil hak akses user dari database dengan relasi yang benar
            $hakAkses = $user->hakAkses()
                           ->where('m_hak_akses.isDeleted', 0)
                           ->where('set_user_hak_akses.isDeleted', 0)
                           ->get();
            
            // Log untuk debugging
            Log::info('User login: ' . $user->getAttribute('username'));
            Log::info('Hak akses ditemukan: ' . $hakAkses->count());
            Log::info('Detail hak akses:', $hakAkses->toArray());

            if ($hakAkses->isEmpty()) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses!'
                ], 403);
            }

            // Jika hanya memiliki 1 hak akses, langsung set session dan ke dashboard
            if ($hakAkses->count() == 1) {
                $selectedHakAkses = $hakAkses->first();
                Session::put('selected_hak_akses', [
                    'm_hak_akses_id' => $selectedHakAkses->m_hak_akses_id,
                    'hak_akses_kode' => $selectedHakAkses->hak_akses_kode,
                    'hak_akses_nama' => $selectedHakAkses->hak_akses_nama
                ]);
                
                Log::info('Auto select single hak akses:', [
                    'm_hak_akses_id' => $selectedHakAkses->m_hak_akses_id,
                    'hak_akses_nama' => $selectedHakAkses->hak_akses_nama
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Login berhasil!',
                    'redirect' => '/dashboard'
                ]);
            }

            // Jika lebih dari 1 hak akses, format data untuk session
            $hakAksesArray = $hakAkses->map(function($item) {
                return [
                    'm_hak_akses_id' => $item->m_hak_akses_id,
                    'hak_akses_kode' => $item->hak_akses_kode,
                    'hak_akses_nama' => $item->hak_akses_nama
                ];
            })->toArray();

            Session::put('available_hak_akses', $hakAksesArray);
            
            Log::info('Multiple hak akses found, redirect to pilih-level:', $hakAksesArray);
            
            return response()->json([
                'success' => true,
                'message' => 'Silakan pilih level hak akses!',
                'redirect' => '/pilih-level'
            ]);

        } catch (\Exception $e) {
            Log::error('Error dalam postLogin: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Tampilkan halaman pilih level
    public function pilihLevel()
    {
        // Cek apakah user sudah login
        if (!Auth::check()) {
            return redirect('/login');
        }

        // Cek apakah ada hak akses yang tersedia
        $hakAkses = Session::get('available_hak_akses');
        if (!$hakAkses || empty($hakAkses)) {
            return redirect('/login');
        }

        return view('Authentication.pilih-level');
    }

    // Proses pilih level
    public function postPilihLevel(Request $request)
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

            return response()->json([
                'success' => true,
                'message' => 'Hak akses berhasil dipilih!',
                'redirect' => '/dashboard'
            ]);

        } catch (\Exception $e) {
            Log::error('Error dalam postPilihLevel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Logout
    public function logout()
    {
        Auth::logout();
        Session::flush();
        return redirect('/login')->with('message', 'Anda telah berhasil logout!');
    }
}