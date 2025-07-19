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

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->fillable = array_merge($this->fillable, $this->getCommonFields());
    }

    // Relasi dengan user
    public function users()
    {
        return $this->belongsToMany(
            UserModel::class,
            'm_set_user_hak_akses',
            'fk_m_hak_akses',
            'fk_m_user',
            'm_hak_akses_id',
            'm_user_id'
        );
    }
}
