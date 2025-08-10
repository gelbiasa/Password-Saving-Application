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
    
    public $timestamps = false;
    
    protected $fillable = [
        'fk_m_kategori_password',
        'fk_m_user',
        'dp_nama_username',
        'dp_nama_password',
        'dp_pin',
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
     * ✅ Encrypt username saat disimpan
     */
    public function setDpNamaUsernameAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['dp_nama_username'] = Crypt::encryptString($value);
        }
    }

    /**
     * ✅ Encrypt password saat disimpan
     */
    public function setDpNamaPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['dp_nama_password'] = Crypt::encryptString($value);
        }
    }

    /**
     * ✅ Hash PIN sebelum disimpan
     */
    public function setDpPinAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['dp_pin'] = Hash::make($value);
        }
    }

    // ✅ HAPUS accessor yang konflik - data akan di-decrypt manual di getDecryptedData()
    // Jangan pakai getDpNamaUsernameAttribute dan getDpNamaPasswordAttribute
    // karena konflik dengan data yang sudah encrypted di database

    /**
     * ✅ Method untuk verifikasi PIN
     */
    public function verifyPin($pin)
    {
        return Hash::check($pin, $this->getOriginal('dp_pin'));
    }

    /**
     * ✅ Enhanced getDecryptedData untuk modal detail - FIX DECRYPTION
     */
    public function getDecryptedData()
    {
        // Ambil data mentah tanpa mutator/accessor
        $data = $this->getAttributes();
        
        // Tambah data relasi
        if ($this->relationLoaded('kategoriPassword')) {
            $data['kategori_password'] = $this->kategoriPassword ? $this->kategoriPassword->toArray() : null;
        }

        // Tambah ID dan timestamps
        $data['m_detail_password_id'] = $this->m_detail_password_id;
        $data['created_at'] = $this->created_at;
        $data['updated_at'] = $this->updated_at;
        $data['deleted_at'] = $this->deleted_at;

        // ✅ Decrypt username dengan pengecekan yang lebih robust
        if (!empty($data['dp_nama_username'])) {
            try {
                // Cek apakah data sudah dalam format encrypted Laravel
                if (str_starts_with($data['dp_nama_username'], 'eyJpdiI6') || 
                    str_starts_with($data['dp_nama_username'], 'ey')) {
                    // Data dalam format base64 encrypted Laravel
                    $decrypted = Crypt::decryptString($data['dp_nama_username']);
                    $data['dp_nama_username_decrypted'] = $decrypted;
                    $data['dp_nama_username_masked'] = $this->maskSensitiveData($decrypted);
                } else {
                    // Data mungkin plain text atau format lain
                    $data['dp_nama_username_decrypted'] = $data['dp_nama_username'];
                    $data['dp_nama_username_masked'] = $this->maskSensitiveData($data['dp_nama_username']);
                }
            } catch (\Exception $e) {
                Log::error('Error decrypting username for ID ' . $this->m_detail_password_id . ': ' . $e->getMessage());
                Log::error('Username data: ' . substr($data['dp_nama_username'], 0, 50) . '...');
                
                // Fallback: tampilkan data as-is jika tidak bisa decrypt
                $data['dp_nama_username_decrypted'] = '[Encrypted Data - Cannot Display]';
                $data['dp_nama_username_masked'] = '***';
            }
        } else {
            $data['dp_nama_username_decrypted'] = '';
            $data['dp_nama_username_masked'] = '***';
        }

        // ✅ Decrypt password dengan pengecekan yang lebih robust  
        if (!empty($data['dp_nama_password'])) {
            try {
                // Cek apakah data sudah dalam format encrypted Laravel
                if (str_starts_with($data['dp_nama_password'], 'eyJpdiI6') || 
                    str_starts_with($data['dp_nama_password'], 'ey')) {
                    // Data dalam format base64 encrypted Laravel
                    $decrypted = Crypt::decryptString($data['dp_nama_password']);
                    $data['dp_nama_password_decrypted'] = $decrypted;
                    $data['dp_nama_password_masked'] = $this->maskPassword($decrypted);
                } else {
                    // Data mungkin plain text atau format lain
                    $data['dp_nama_password_decrypted'] = $data['dp_nama_password'];
                    $data['dp_nama_password_masked'] = $this->maskPassword($data['dp_nama_password']);
                }
            } catch (\Exception $e) {
                Log::error('Error decrypting password for ID ' . $this->m_detail_password_id . ': ' . $e->getMessage());
                Log::error('Password data: ' . substr($data['dp_nama_password'], 0, 50) . '...');
                
                // Fallback: tampilkan data as-is jika tidak bisa decrypt
                $data['dp_nama_password_decrypted'] = '[Encrypted Data - Cannot Display]';
                $data['dp_nama_password_masked'] = '***';
            }
        } else {
            $data['dp_nama_password_decrypted'] = '';
            $data['dp_nama_password_masked'] = '***';
        }

        // ✅ PIN status dan masking
        $data['dp_pin_masked'] = !empty($data['dp_pin']) ? '****' : 'Not Set';
        $data['has_pin'] = !empty($data['dp_pin']);

        return $data;
    }

    /**
     * ✅ Method untuk mendapat data raw (encrypted) untuk debugging
     */
    public function getRawEncryptedData()
    {
        return [
            'id' => $this->m_detail_password_id,
            'username_encrypted' => $this->getOriginal('dp_nama_username'),
            'password_encrypted' => $this->getOriginal('dp_nama_password'),
            'username_length' => strlen($this->getOriginal('dp_nama_username')),
            'password_length' => strlen($this->getOriginal('dp_nama_password')),
            'username_starts_with' => substr($this->getOriginal('dp_nama_username'), 0, 10),
            'password_starts_with' => substr($this->getOriginal('dp_nama_password'), 0, 10),
        ];
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

    // ✅ Method untuk tes decryption
    public function testDecryption()
    {
        $results = [];
        
        // Test username
        if (!empty($this->getOriginal('dp_nama_username'))) {
            try {
                $decrypted = Crypt::decryptString($this->getOriginal('dp_nama_username'));
                $results['username'] = [
                    'status' => 'SUCCESS',
                    'decrypted' => $decrypted,
                    'original_length' => strlen($this->getOriginal('dp_nama_username'))
                ];
            } catch (\Exception $e) {
                $results['username'] = [
                    'status' => 'ERROR',
                    'error' => $e->getMessage(),
                    'original_sample' => substr($this->getOriginal('dp_nama_username'), 0, 50)
                ];
            }
        }

        // Test password  
        if (!empty($this->getOriginal('dp_nama_password'))) {
            try {
                $decrypted = Crypt::decryptString($this->getOriginal('dp_nama_password'));
                $results['password'] = [
                    'status' => 'SUCCESS',
                    'decrypted' => $decrypted,
                    'original_length' => strlen($this->getOriginal('dp_nama_password'))
                ];
            } catch (\Exception $e) {
                $results['password'] = [
                    'status' => 'ERROR',
                    'error' => $e->getMessage(),
                    'original_sample' => substr($this->getOriginal('dp_nama_password'), 0, 50)
                ];
            }
        }

        return $results;
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

    /**
     * ✅ Method untuk verifikasi password login pengguna yang membuat password
     */
    public function verifyUserPassword($password)
    {
        // Load relasi user jika belum di-load
        if (!$this->relationLoaded('user')) {
            $this->load('user');
        }

        if (!$this->user) {
            return false;
        }

        return Hash::check($password, $this->user->password);
    }

    /**
     * ✅ Method untuk mendapatkan info user pembuat password
     */
    public function getCreatorInfo()
    {
        // Load relasi user jika belum di-load
        if (!$this->relationLoaded('user')) {
            $this->load('user');
        }

        if (!$this->user) {
            return null;
        }

        return [
            'user_id' => $this->user->m_user_id,
            'username' => $this->user->username,
            'nama_pengguna' => $this->user->nama_pengguna,
            'email_pengguna' => $this->user->email_pengguna
        ];
    }

    /**
     * ✅ Method untuk verifikasi dual security (User Password + PIN)
     */
    public function verifyDualSecurity($userPassword, $pin = null)
    {
        $results = [
            'user_password_valid' => false,
            'pin_valid' => false,
            'both_valid' => false,
            'creator_info' => null
        ];

        // 1. Verifikasi password user pembuat
        $results['user_password_valid'] = $this->verifyUserPassword($userPassword);
        $results['creator_info'] = $this->getCreatorInfo();

        // 2. Verifikasi PIN (jika ada)
        if (!empty($this->getOriginal('dp_pin')) && !empty($pin)) {
            $results['pin_valid'] = $this->verifyPin($pin);
        } else if (empty($this->getOriginal('dp_pin'))) {
            // Jika tidak ada PIN, anggap PIN valid
            $results['pin_valid'] = true;
        }

        // 3. Kedua verifikasi harus valid
        $results['both_valid'] = $results['user_password_valid'] && $results['pin_valid'];

        return $results;
    }
}