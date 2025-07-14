<?php

namespace App\Models\ManagePengguna;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;

class HakAksesModel extends Model
{
    use TraitsModel;

    protected $table = 'm_hak_akses'; 
    protected $primaryKey = 'm_hak_akses_id'; 
    protected $fillable = [
        'hak_akses_kode',
        'hak_akses_nama'
    ];
}
