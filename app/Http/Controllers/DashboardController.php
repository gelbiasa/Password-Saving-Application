<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return view('pages.dashboard');
    }
    
    public function getDashboardData()
    {
        $data = [
            'totalPasswords' => 25,
            'weakPasswords' => 3,
            'strongPasswords' => 22
        ];
        
        return response()->json($data);
    }
}