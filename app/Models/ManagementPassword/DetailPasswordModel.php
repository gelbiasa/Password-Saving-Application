<?php

namespace App\Models\ManagementPassword;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DetailPasswordModel extends Model
{
    use TraitsModel;

    protected $table = 'm_detail_password';
    protected $primaryKey = 'm_detail_password_id';
    
    // Disable timestamps Laravel karena kita handle manual
    public $timestamps = false;
    
    protected $fillable = [
        'fk_m_kategori_password',
        'fk_m_user',
        'dp_nama_username',
        'dp_nama_password',
        'dp_keterangan'
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

    /**
     * Relasi dengan kategori password
     */
    public function kategoriPassword()
    {
        return $this->belongsTo(
            KategoriPasswordModel::class,
            'fk_m_kategori_password',
            'm_kategori_password_id'
        )->where('isDeleted', 0);
    }

    /**
     * Relasi dengan user
     */
    public function user()
    {
        return $this->belongsTo(
            \App\Models\ManagePengguna\UserModel::class,
            'fk_m_user',
            'm_user_id'
        )->where('isDeleted', 0);
    }

    /**
     * Encrypt username dan password sebelum disimpan
     */
    public function setDpNamaUsernameAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['dp_nama_username'] = Crypt::encryptString($value);
        }
    }

    public function setDpNamaPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['dp_nama_password'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt username dan password saat diambil
     */
    public function getDpNamaUsernameAttribute($value)
    {
        if (!empty($value)) {
            try {
                return Crypt::decryptString($value);
            } catch (\Exception $e) {
                Log::error('Error decrypting username: ' . $e->getMessage());
                return '[Error: Cannot decrypt]';
            }
        }
        return $value;
    }

    public function getDpNamaPasswordAttribute($value)
    {
        if (!empty($value)) {
            try {
                return Crypt::decryptString($value);
            } catch (\Exception $e) {
                Log::error('Error decrypting password: ' . $e->getMessage());
                return '[Error: Cannot decrypt]';
            }
        }
        return $value;
    }

    /**
     * Method untuk mendapatkan data dengan decryption manual (untuk keperluan tampilan)
     */
    public function getDecryptedData()
    {
        $data = $this->toArray();
        
        // Decrypt username dan password
        if (!empty($this->getOriginal('dp_nama_username'))) {
            try {
                $data['dp_nama_username_decrypted'] = Crypt::decryptString($this->getOriginal('dp_nama_username'));
                $data['dp_nama_username_masked'] = $this->maskSensitiveData($data['dp_nama_username_decrypted']);
            } catch (\Exception $e) {
                $data['dp_nama_username_decrypted'] = '[Error: Cannot decrypt]';
                $data['dp_nama_username_masked'] = '***';
            }
        }

        if (!empty($this->getOriginal('dp_nama_password'))) {
            try {
                $data['dp_nama_password_decrypted'] = Crypt::decryptString($this->getOriginal('dp_nama_password'));
                $data['dp_nama_password_masked'] = $this->maskPassword($data['dp_nama_password_decrypted']);
            } catch (\Exception $e) {
                $data['dp_nama_password_decrypted'] = '[Error: Cannot decrypt]';
                $data['dp_nama_password_masked'] = '***';
            }
        }

        return $data;
    }

    /**
     * Mask sensitive data untuk tampilan
     */
    private function maskSensitiveData($data)
    {
        if (strlen($data) <= 3) {
            return str_repeat('*', strlen($data));
        }
        
        return substr($data, 0, 2) . str_repeat('*', strlen($data) - 4) . substr($data, -2);
    }

    /**
     * Mask password untuk tampilan
     */
    private function maskPassword($password)
    {
        return str_repeat('*', strlen($password));
    }

    /**
     * Create new detail password
     */
    public function createData($data)
    {
        try {
            DB::beginTransaction();

            // Validasi kategori password exists
            $kategori = KategoriPasswordModel::where('m_kategori_password_id', $data['fk_m_kategori_password'])
                                           ->where('isDeleted', 0)
                                           ->first();
            
            if (!$kategori) {
                throw new \Exception('Kategori password tidak ditemukan');
            }

            // Validasi user exists jika ada fk_m_user
            if (!empty($data['fk_m_user'])) {
                $user = \App\Models\ManagePengguna\UserModel::where('m_user_id', $data['fk_m_user'])
                                                          ->where('isDeleted', 0)
                                                          ->first();
                
                if (!$user) {
                    throw new \Exception('User tidak ditemukan');
                }
            }

            // Simpan data - encryption akan otomatis dilakukan oleh mutator
            $result = $this->create($data);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Detail password berhasil disimpan',
                'data' => $result->load('kategoriPassword')
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating detail password: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal menyimpan detail password: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Update detail password
     */
    public function updateData($id, $data)
    {
        try {
            DB::beginTransaction();

            $detailPassword = $this->where('m_detail_password_id', $id)
                                  ->where('isDeleted', 0)
                                  ->firstOrFail();

            // Validasi kategori password exists
            if (!empty($data['fk_m_kategori_password'])) {
                $kategori = KategoriPasswordModel::where('m_kategori_password_id', $data['fk_m_kategori_password'])
                                               ->where('isDeleted', 0)
                                               ->first();
                
                if (!$kategori) {
                    throw new \Exception('Kategori password tidak ditemukan');
                }
            }

            // Validasi user exists jika ada fk_m_user
            if (!empty($data['fk_m_user'])) {
                $user = \App\Models\ManagePengguna\UserModel::where('m_user_id', $data['fk_m_user'])
                                                          ->where('isDeleted', 0)
                                                          ->first();
                
                if (!$user) {
                    throw new \Exception('User tidak ditemukan');
                }
            }

            // Update data - encryption akan otomatis dilakukan oleh mutator
            $detailPassword->update($data);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Detail password berhasil diperbarui',
                'data' => $detailPassword->fresh(['kategoriPassword'])
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating detail password: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memperbarui detail password: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Delete detail password (soft delete)
     */
    public function deleteData($id)
    {
        try {
            DB::beginTransaction();

            $detailPassword = $this->where('m_detail_password_id', $id)
                                  ->where('isDeleted', 0)
                                  ->firstOrFail();

            // Soft delete - akan dihandle otomatis oleh boot function
            $detailPassword->delete();

            DB::commit();

            return [
                'success' => true,
                'message' => 'Detail password berhasil dihapus'
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting detail password: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal menghapus detail password: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Restore detail password
     */
    public function restoreData($id)
    {
        try {
            DB::beginTransaction();

            $detailPassword = $this->where('m_detail_password_id', $id)
                                  ->where('isDeleted', 1)
                                  ->firstOrFail();

            // Restore data
            $detailPassword->customRestore();

            DB::commit();

            return [
                'success' => true,
                'message' => 'Detail password berhasil dipulihkan'
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error restoring detail password: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memulihkan detail password: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get all active detail passwords with relations
     */
    public function getAllData($userId = null)
    {
        try {
            $query = $this->with(['kategoriPassword'])
                          ->where('isDeleted', 0)
                          ->orderBy('created_at', 'desc');

            // Filter by user if provided
            if ($userId) {
                $query->where('fk_m_user', $userId);
            }

            $results = $query->get();

            // Decrypt data for display
            $decryptedResults = $results->map(function ($item) {
                return $item->getDecryptedData();
            });

            return $decryptedResults;

        } catch (\Exception $e) {
            Log::error('Error in getAllData: ' . $e->getMessage());
            return collect(); // Return empty collection
        }
    }

    /**
     * Get deleted detail passwords
     */
    public function getDeletedData($userId = null)
    {
        try {
            $query = $this->with(['kategoriPassword'])
                          ->where('isDeleted', 1)
                          ->orderBy('deleted_at', 'desc');

            // Filter by user if provided
            if ($userId) {
                $query->where('fk_m_user', $userId);
            }

            $results = $query->get();

            // Decrypt data for display
            $decryptedResults = $results->map(function ($item) {
                return $item->getDecryptedData();
            });

            return $decryptedResults;

        } catch (\Exception $e) {
            Log::error('Error in getDeletedData: ' . $e->getMessage());
            return collect(); // Return empty collection
        }
    }

    /**
     * Get detail password by ID with decryption
     */
    public function getById($id, $decrypt = true)
    {
        try {
            $detailPassword = $this->with(['kategoriPassword'])
                                  ->where('m_detail_password_id', $id)
                                  ->where('isDeleted', 0)
                                  ->first();

            if (!$detailPassword) {
                return null;
            }

            if ($decrypt) {
                return $detailPassword->getDecryptedData();
            }

            return $detailPassword;

        } catch (\Exception $e) {
            Log::error('Error getting detail password by ID: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get count of detail passwords
     */
    public function getCount($userId = null)
    {
        try {
            $query = $this->where('isDeleted', 0);

            if ($userId) {
                $query->where('fk_m_user', $userId);
            }

            return $query->count();

        } catch (\Exception $e) {
            Log::error('Error getting detail password count: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Search detail passwords
     */
    public function searchData($keyword, $userId = null)
    {
        try {
            $query = $this->with(['kategoriPassword'])
                          ->where('isDeleted', 0);

            if ($userId) {
                $query->where('fk_m_user', $userId);
            }

            // Search in keterangan and kategori nama
            $query->where(function ($q) use ($keyword) {
                $q->where('dp_keterangan', 'LIKE', "%{$keyword}%")
                  ->orWhereHas('kategoriPassword', function ($subQ) use ($keyword) {
                      $subQ->where('kp_nama', 'LIKE', "%{$keyword}%");
                  });
            });

            $results = $query->orderBy('created_at', 'desc')->get();

            // Decrypt data for display
            $decryptedResults = $results->map(function ($item) {
                return $item->getDecryptedData();
            });

            return $decryptedResults;

        } catch (\Exception $e) {
            Log::error('Error searching detail passwords: ' . $e->getMessage());
            return collect();
        }
    }
}