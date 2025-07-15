<?php

namespace App\Models\ManagePengguna;

use App\Models\TraitsModel;
use Illuminate\Database\Eloquent\Model;

class UserModel extends Model
{
    use TraitsModel;

    protected $table = 'm_user';
    protected $primaryKey = 'm_user_id';
    protected $fillable = [
        'username',
        'password',
        'nama_pengguna',
        'alamat_pengguna',
        'no_hp_pengguna',
        'email_pengguna',
        'jenis_kelamin_pengguna',
        'foto_profil',
        'isBloked'
    ];
}
