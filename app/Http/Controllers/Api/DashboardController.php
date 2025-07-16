<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
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