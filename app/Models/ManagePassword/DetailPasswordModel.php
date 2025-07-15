<?php

namespace App\Models\ManagePassword;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;

class DetailPasswordModel extends Model
{
    use TraitsModel;

    protected $table = 'm_detail_password';
    protected $primaryKey = 'm_detail_password_id';
    protected $fillable = [
        'fk_m_kategori_password',
        'fk_m_user',
        'dp_nama_username',
        'dp_nama_password',
        'dp_keterangan'
    ];
}
