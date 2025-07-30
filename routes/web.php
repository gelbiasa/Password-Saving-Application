<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Pages\DashboardController;
use App\Http\Controllers\Pages\ManagementPassword\KategoriPasswordController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('login', [AuthController::class, 'login'])->name('login');
Route::post('login', [AuthController::class, 'postLogin']);
Route::get('pilih-level', [AuthController::class, 'pilihLevel'])->middleware('auth');
Route::post('pilih-level', [AuthController::class, 'postPilihLevel'])->middleware('auth');
Route::get('logout', [AuthController::class, 'logout'])->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/kategori-password', [KategoriPasswordController::class, 'getData']);
    Route::get('/kategori-password/deleted', [KategoriPasswordController::class, 'getDeletedData']);
    Route::post('/kategori-password', [KategoriPasswordController::class, 'store']);
    Route::put('/kategori-password/{id}', [KategoriPasswordController::class, 'update']);
    Route::delete('/kategori-password/{id}', [KategoriPasswordController::class, 'destroy']);
    Route::post('/kategori-password/{id}/restore', [KategoriPasswordController::class, 'restore']);
});
