<?php

namespace App\Models\ManagementPassword;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class KategoriPasswordModel extends Model
{
    use TraitsModel;

    protected $table = 'm_kategori_password';
    protected $primaryKey = 'm_kategori_password_id';
    protected $fillable = [
        'kp_kode',
        'kp_nama'
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->fillable = array_merge($this->fillable, $this->getCommonFields());
    }

    public function createData($data) 
    {
        try {
            // Generate kode otomatis jika tidak ada
            if (empty($data['kp_kode'])) {
                $data['kp_kode'] = $this->generateKode();
            }

            // Validasi kode unik
            if ($this->where('kp_kode', $data['kp_kode'])->exists()) {
                throw new \Exception('Kode kategori sudah ada');
            }

            // Set data tambahan
            $data['created_by'] = Auth::id() ?? 1; // Default ke 1 jika tidak ada user login
            $data['isDeleted'] = 0;

            // Simpan data
            $result = $this->create($data);

            return [
                'success' => true,
                'message' => 'Data berhasil disimpan',
                'data' => $result
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    private function generateKode()
    {
        $lastData = $this->orderBy('m_kategori_password_id', 'desc')->first();
        
        if (!$lastData) {
            return 'KP001';
        }

        $lastNumber = (int) substr($lastData->kp_kode, 2);
        $newNumber = $lastNumber + 1;
        
        return 'KP' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }

    public function updateData($id, $data)
    {
        try {
            $kategori = $this->findOrFail($id);
            
            // Validasi kode unik (kecuali untuk data yang sedang diedit)
            if (isset($data['kp_kode'])) {
                $exists = $this->where('kp_kode', $data['kp_kode'])
                             ->where('m_kategori_password_id', '!=', $id)
                             ->exists();
                
                if ($exists) {
                    throw new \Exception('Kode kategori sudah ada');
                }
            }

            $data['updated_by'] = Auth::id() ?? 1;
            $kategori->update($data);

            return [
                'success' => true,
                'message' => 'Data berhasil diupdate',
                'data' => $kategori
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal mengupdate data: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    public function deleteData($id)
    {
        try {
            $kategori = $this->findOrFail($id);
            
            // Soft delete
            $kategori->update([
                'isDeleted' => 1,
                'deleted_by' => Auth::id() ?? 1,
                'deleted_at' => now()
            ]);

            return [
                'success' => true,
                'message' => 'Data berhasil dihapus'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage()
            ];
        }
    }

    public function getAllData()
    {
        return $this->where('isDeleted', 0)
                   ->orderBy('created_at', 'desc')
                   ->get();
    }
}
