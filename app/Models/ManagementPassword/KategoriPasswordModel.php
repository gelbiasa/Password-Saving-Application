<?php

namespace App\Models\ManagementPassword;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;

class KategoriPasswordModel extends Model
{
    use TraitsModel;

    protected $table = 'm_kategori_password';
    protected $primaryKey = 'm_kategori_password_id';
    
    // Disable timestamps Laravel karena kita handle manual
    public $timestamps = false;
    
    protected $fillable = [
        'kp_kode',
        'kp_nama'
    ];

    protected $dates = [
        'created_at',
        'updated_at', 
        'deleted_at'
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
            if ($this->where('kp_kode', $data['kp_kode'])->where('isDeleted', 0)->exists()) {
                throw new \Exception('Kode kategori sudah ada');
            }

            // Simpan data - common fields akan dihandle otomatis oleh boot function
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
        $lastData = $this->where('isDeleted', 0)
                        ->orderBy('m_kategori_password_id', 'desc')
                        ->first();
        
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
            $kategori = $this->where('m_kategori_password_id', $id)
                            ->where('isDeleted', 0)
                            ->firstOrFail();
            
            // Validasi kode unik (kecuali untuk data yang sedang diedit)
            if (isset($data['kp_kode'])) {
                $exists = $this->where('kp_kode', $data['kp_kode'])
                             ->where('m_kategori_password_id', '!=', $id)
                             ->where('isDeleted', 0)
                             ->exists();
                
                if ($exists) {
                    throw new \Exception('Kode kategori sudah ada');
                }
            }

            // Update data - common fields akan dihandle otomatis oleh boot function
            $kategori->update($data);

            return [
                'success' => true,
                'message' => 'Data berhasil diperbarui',
                'data' => $kategori->fresh()
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    public function deleteData($id)
    {
        try {
            $kategori = $this->where('m_kategori_password_id', $id)
                            ->where('isDeleted', 0)
                            ->firstOrFail();
            
            // Soft delete - akan dihandle otomatis oleh boot function
            $kategori->delete();

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

    public function restoreData($id)
    {
        try {
            $kategori = $this->where('m_kategori_password_id', $id)
                            ->where('isDeleted', 1)
                            ->firstOrFail();
            
            // Restore data
            $kategori->restore();

            return [
                'success' => true,
                'message' => 'Data berhasil dipulihkan'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal memulihkan data: ' . $e->getMessage()
            ];
        }
    }

    public function getAllData()
    {
        return $this->notDeleted()
                   ->orderBy('created_at', 'desc')
                   ->get();
    }

    public function getDeletedData()
    {
        return $this->onlyDeleted()
                   ->orderBy('deleted_at', 'desc')
                   ->get();
    }
}