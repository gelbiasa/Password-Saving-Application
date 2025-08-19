<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Pages\DashboardController;
use App\Http\Controllers\Pages\ManagementPassword\DetailPasswordController;
use App\Http\Controllers\Pages\ManagementPassword\KategoriPasswordController;
use App\Http\Controllers\Pages\ManagementPengguna\UserController;
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
    Route::get('/dashboard-admin', [DashboardController::class, 'index'])->name('dashboard-admin');
    Route::get('/kategori-password', [KategoriPasswordController::class, 'index'])->name('kategori-password');
    Route::get('/detail-password', [DetailPasswordController::class, 'index']);
    Route::get('/management-user', [UserController::class, 'index'])->name('management-user');
});