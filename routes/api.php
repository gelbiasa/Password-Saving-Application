<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Pages\ManagementPassword\DetailPasswordController;
use App\Http\Controllers\Pages\ManagementPassword\KategoriPasswordController;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/hak-akses-user', [AuthController::class, 'getHakAksesUser'])->middleware('web');
Route::post('/set-hak-akses', [AuthController::class, 'setHakAkses'])->middleware('web');
Route::get('/current-user', [AuthController::class, 'getCurrentUser'])->middleware('web'); // Route baru

// ✅ New routes untuk switching hak akses
Route::get('/user-hak-akses-list', [AuthController::class, 'getAllUserHakAkses'])->middleware('web');
Route::post('/switch-hak-akses', [AuthController::class, 'switchHakAkses'])->middleware('web');

Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);
Route::get('/dashboard-admin-data', [DashboardController::class, 'getDashboardAdminData'])->middleware('web'); // ✅ New route

Route::middleware('web')->group(function () {
    Route::get('/kategori-password', [KategoriPasswordController::class, 'getData']);
    Route::get('/kategori-password/count', [KategoriPasswordController::class, 'getCount']); // New route
    Route::get('/kategori-password/deleted', [KategoriPasswordController::class, 'getDeletedData']);
    Route::post('/kategori-password', [KategoriPasswordController::class, 'store']);
    Route::put('/kategori-password/{id}', [KategoriPasswordController::class, 'update']);
    Route::delete('/kategori-password/{id}', [KategoriPasswordController::class, 'destroy']);
    Route::post('/kategori-password/{id}/restore', [KategoriPasswordController::class, 'restore']);
});

// Detail Password Management Routes
Route::prefix('detail-password')->group(function () {
    Route::get('/', [DetailPasswordController::class, 'getData']);
    Route::get('/deleted', [DetailPasswordController::class, 'getDeletedData']);
    Route::get('/count', [DetailPasswordController::class, 'getCount']);
    Route::get('/search', [DetailPasswordController::class, 'search']);
    Route::get('/kategori-options', [DetailPasswordController::class, 'getKategoriOptions']);
    Route::get('/user-options', [DetailPasswordController::class, 'getUserOptions']);
    
    Route::get('/{id}', [DetailPasswordController::class, 'show']);
    Route::get('/{id}/detail', [DetailPasswordController::class, 'getDetailById']);
    Route::get('/{id}/full-data', [DetailPasswordController::class, 'getFullDecryptedData']); // ✅ New route untuk data lengkap setelah verifikasi
    
    Route::post('/{id}/verify-user-password', [DetailPasswordController::class, 'verifyUserPassword']); // ✅ New route untuk verifikasi password user
    Route::post('/{id}/verify-dual-security', [DetailPasswordController::class, 'verifyDualSecurity']); // ✅ New route untuk dual verification
    Route::post('/{id}/verify-pin', [DetailPasswordController::class, 'verifyPin']); // Existing PIN verification
    
    Route::post('/', [DetailPasswordController::class, 'store']);
    Route::put('/{id}', [DetailPasswordController::class, 'update']);
    Route::delete('/{id}', [DetailPasswordController::class, 'destroy']);
    Route::post('/{id}/restore', [DetailPasswordController::class, 'restore']);
});