<?php

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

Route::middleware('auth')->get('/hak-akses-user', function() {
    $hakAkses = Session::get('available_hak_akses');
    return response()->json($hakAkses ?: []);
});

Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);
Route::get('/kategori-password', [KategoriPasswordController::class, 'getData']);
Route::post('/kategori-password', [KategoriPasswordController::class, 'store']);
Route::put('/kategori-password/{id}', [KategoriPasswordController::class, 'update']);
Route::delete('/kategori-password/{id}', [KategoriPasswordController::class, 'destroy']);
