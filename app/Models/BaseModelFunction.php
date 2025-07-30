<?php

namespace App\Models;

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
