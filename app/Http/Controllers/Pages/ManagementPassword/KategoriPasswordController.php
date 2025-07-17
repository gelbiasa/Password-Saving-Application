<?php

namespace App\Http\Controllers\Pages\ManagementPassword;

use App\Http\Controllers\Controller;
use App\Models\ManagementPassword\KategoriPasswordModel;
use Illuminate\Http\Request;

class KategoriPasswordController extends Controller
{
    protected $model;

    public function __construct()
    {
        $this->model = new KategoriPasswordModel();
    }

    public function index()
    {
        return view('Pages.ManagementPassword.KategoriPassword.index');
    }

    public function getData()
    {
        try {
            $data = $this->model->getAllData();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'kp_kode' => 'required|string|max:10',
            'kp_nama' => 'required|string|max:100'
        ]);

        $result = $this->model->createData($request->all());
        
        return response()->json($result);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kp_kode' => 'required|string|max:10',
            'kp_nama' => 'required|string|max:100'
        ]);

        $result = $this->model->updateData($id, $request->all());
        
        return response()->json($result);
    }

    public function destroy($id)
    {
        $result = $this->model->deleteData($id);
        
        return response()->json($result);
    }
}