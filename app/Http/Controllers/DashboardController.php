<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $data = [
            'totalPasswords' => 25,
            'weakPasswords' => 3,
            'strongPasswords' => 22
        ];
        
        return view('dashboard', compact('data'));
    }
}