<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

trait BaseModelFunction
{
    protected $commonFields = [
        'isDeleted',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'deleted_at',
        'deleted_by'
    ];

    public function getCommonFields()
    {
        return $this->commonFields;
    }

    /**
     * Boot function untuk handle common fields secara otomatis
     */
    protected static function bootBaseModelFunction()
    {
        // Event ketika data dibuat (creating)
        static::creating(function ($model) {
            $user = Auth::user();
            $aliasUser = '';
            
            if ($user) {
                // Gunakan method generateAlias dari trait ini
                $aliasUser = $model->generateAlias($user->nama_pengguna ?? $user->username ?? '');
            } else {
                $aliasUser = 'System';
            }
            
            // Set timezone Asia/Jakarta
            $waktuSekarang = Carbon::now('Asia/Jakarta');
            
            $model->created_at = $waktuSekarang;
            $model->created_by = $aliasUser;
            $model->isDeleted = 0;
        });

        // Event ketika data diupdate (updating)
        static::updating(function ($model) {
            $user = Auth::user();
            $aliasUser = '';
            
            if ($user) {
                // Gunakan method generateAlias dari trait ini
                $aliasUser = $model->generateAlias($user->nama_pengguna ?? $user->username ?? '');
            } else {
                $aliasUser = 'System';
            }
            
            // Set timezone Asia/Jakarta
            $waktuSekarang = Carbon::now('Asia/Jakarta');
            
            $model->updated_at = $waktuSekarang;
            $model->updated_by = $aliasUser;
        });

        // Event ketika data dihapus (deleting)
        static::deleting(function ($model) {
            $user = Auth::user();
            $aliasUser = '';
            
            if ($user) {
                // Gunakan method generateAlias dari trait ini
                $aliasUser = $model->generateAlias($user->nama_pengguna ?? $user->username ?? '');
            } else {
                $aliasUser = 'System';
            }
            
            // Set timezone Asia/Jakarta
            $waktuSekarang = Carbon::now('Asia/Jakarta');
            
            // Soft delete - update isDeleted menjadi 1
            $model->isDeleted = 1;
            $model->deleted_at = $waktuSekarang;
            $model->deleted_by = $aliasUser;
            
            // Simpan perubahan tanpa trigger event lagi
            $model->saveQuietly();
            
            // Return false agar delete asli tidak terjadi (karena kita pakai soft delete)
            return false;
        });
    }

    /**
     * Override delete method untuk soft delete
     */
    public function delete()
    {
        return static::deleting($this);
    }

    /**
     * Method untuk restore data yang sudah di-soft delete
     */
    public function customRestore()
    {
        $user = Auth::user();
        $aliasUser = '';
        
        if ($user) {
            // Gunakan method generateAlias dari trait ini
            $aliasUser = $this->generateAlias($user->nama_pengguna ?? $user->username ?? '');
        } else {
            $aliasUser = 'System';
        }
        
        $waktuSekarang = Carbon::now('Asia/Jakarta');
        
        $this->isDeleted = 0;
        $this->deleted_at = null;
        $this->deleted_by = null;
        $this->updated_at = $waktuSekarang;
        $this->updated_by = $aliasUser;
        
        return $this->save();
    }

    /**
     * Scope untuk mengambil data yang tidak dihapus
     */
    public function scopeNotDeleted($query)
    {
        return $query->where('isDeleted', 0);
    }

    /**
     * Scope untuk mengambil data yang sudah dihapus
     */
    public function scopeOnlyDeleted($query)
    {
        return $query->where('isDeleted', 1);
    }

    /**
     * Generate alias dari nama pengguna dengan maksimal 10 huruf
     * Contoh: 
     * - "M. Isroqi Gelby" menjadi "M. Isroqi G."
     * - "Jordan Sujonoko" menjadi "Jordan S."
     * 
     * @param string $namaPengguna
     * @return string
     */
    public function generateAlias($namaPengguna)
    {
        if (empty($namaPengguna)) {
            return '';
        }

        // Hapus spasi berlebihan dan buat array kata
        $kata = explode(' ', trim($namaPengguna));
        
        // Jika hanya satu kata, ambil maksimal 10 karakter
        if (count($kata) <= 1) {
            return substr($namaPengguna, 0, 10);
        }

        $alias = '';
        $panjangTotalKarakter = 0;
        
        // Iterasi setiap kata
        for ($i = 0; $i < count($kata); $i++) {
            $kataSekarang = $kata[$i];
            
            // Jika kata terakhir
            if ($i == count($kata) - 1) {
                // Untuk kata terakhir, ambil huruf pertama + titik
                $tambahan = substr($kataSekarang, 0, 1) . '.';
                
                // Cek apakah masih muat dalam 10 karakter
                if ($panjangTotalKarakter + strlen($tambahan) <= 10) {
                    $alias .= $tambahan;
                } else {
                    // Jika tidak muat, potong kata sebelumnya
                    $alias = $this->potongAliasJikaTerlampauPanjang($alias, $tambahan);
                }
                break;
            } else {
                // Untuk kata yang bukan terakhir
                $spasi = ($i > 0) ? ' ' : '';
                $tambahan = $spasi . $kataSekarang;
                
                // Cek apakah masih muat (sisakan ruang untuk kata terakhir minimal 3 karakter " X.")
                if ($panjangTotalKarakter + strlen($tambahan) + 3 <= 10) {
                    $alias .= $tambahan;
                    $panjangTotalKarakter += strlen($tambahan);
                } else {
                    // Jika tidak muat, potong kata ini dan lanjut ke kata terakhir
                    $sisaRuang = 10 - $panjangTotalKarakter - 3; // 3 untuk " X."
                    if ($sisaRuang > 0) {
                        $kataYangDipotong = substr($kataSekarang, 0, $sisaRuang);
                        $alias .= $spasi . $kataYangDipotong;
                    }
                    
                    // Tambahkan kata terakhir
                    $kataTerakir = $kata[count($kata) - 1];
                    $alias .= ' ' . substr($kataTerakir, 0, 1) . '.';
                    break;
                }
            }
        }

        return $alias;
    }

    /**
     * Potong alias jika terlampau panjang
     * 
     * @param string $alias
     * @param string $tambahan
     * @return string
     */
    private function potongAliasJikaTerlampauPanjang($alias, $tambahan)
    {
        $panjangTambahan = strlen($tambahan);
        $panjangMaksimal = 10;
        $sisaRuang = $panjangMaksimal - $panjangTambahan;
        
        if ($sisaRuang > 0) {
            return substr($alias, 0, $sisaRuang) . $tambahan;
        }
        
        return substr($alias, 0, $panjangMaksimal);
    }
}