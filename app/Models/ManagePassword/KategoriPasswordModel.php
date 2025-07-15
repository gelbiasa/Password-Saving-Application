<?php

namespace App\Models\ManagePassword;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;

class KategoriPasswordModel extends Model
{
    use TraitsModel;

    protected $table = 'm_kategori_password';
    protected $primaryKey = 'm_kategori_password_id';
    protected $fillable = [
        'kp_kode',
        'kp_nama'
    ];
}
