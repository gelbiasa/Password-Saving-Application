<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
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

Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);
Route::middleware('web')->group(function () {
    Route::get('/kategori-password', [KategoriPasswordController::class, 'getData']);
    Route::get('/kategori-password/count', [KategoriPasswordController::class, 'getCount']); // New route
    Route::get('/kategori-password/deleted', [KategoriPasswordController::class, 'getDeletedData']);
    Route::post('/kategori-password', [KategoriPasswordController::class, 'store']);
    Route::put('/kategori-password/{id}', [KategoriPasswordController::class, 'update']);
    Route::delete('/kategori-password/{id}', [KategoriPasswordController::class, 'destroy']);
    Route::post('/kategori-password/{id}/restore', [KategoriPasswordController::class, 'restore']);
});