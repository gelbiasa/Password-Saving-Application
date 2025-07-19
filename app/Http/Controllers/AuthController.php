<?php

namespace App\Http\Controllers;

use App\Models\ManagePengguna\UserModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
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

            // Cari user berdasarkan username - perbaiki akses data request
            $user = UserModel::where('username', $request->input('username'))
                           ->where('isDeleted', 0)
                           ->first();

            // Validasi user exists dan password benar - perbaiki akses data request
            if (!$user || !Hash::check($request->input('password'), $user->password)) {
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

            // Ambil hak akses user
            $hakAkses = $user->getAllHakAkses();

            if ($hakAkses->isEmpty()) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses!'
                ], 403);
            }

            // Jika hanya memiliki 1 hak akses, langsung set session dan ke dashboard
            if ($hakAkses->count() == 1) {
                Session::put('selected_hak_akses', $hakAkses->first());
                return response()->json([
                    'success' => true,
                    'message' => 'Login berhasil!',
                    'redirect' => '/dashboard'
                ]);
            }

            // Jika lebih dari 1 hak akses, ke halaman pilih level
            Session::put('available_hak_akses', $hakAkses);
            return response()->json([
                'success' => true,
                'message' => 'Silakan pilih level hak akses!',
                'redirect' => '/pilih-level'
            ]);

        } catch (\Exception $e) {
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
        if (!$hakAkses || $hakAkses->isEmpty()) {
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

            $hakAkses = Session::get('available_hak_akses');
            if (!$hakAkses) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data hak akses tidak ditemukan!'
                ], 404);
            }

            // Cari hak akses yang dipilih - perbaiki akses data request
            $selectedHakAkses = $hakAkses->where('m_hak_akses_id', $request->input('hak_akses_id'))->first();
            
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