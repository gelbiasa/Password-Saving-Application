<?php

namespace App\Models\ManagePengguna;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SetUserHakAksesModel extends Model
{
    use TraitsModel;

    protected $table = 'm_set_user_hak_akses';
    protected $primaryKey = 'm_set_user_hak_akses_id';
    protected $fillable = [
        'fk_m_hak_akses',
        'fk_m_user'
    ];
}
