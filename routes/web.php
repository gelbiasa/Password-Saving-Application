<?php

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

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/kategori-password', [KategoriPasswordController::class, 'index'])->name('kategori-password');