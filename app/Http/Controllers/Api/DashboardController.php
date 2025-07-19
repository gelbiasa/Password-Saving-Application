<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

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