<?php

namespace App\Models\ManagementPassword;

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

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->fillable = array_merge($this->fillable, $this->getCommonFields());
    }

    public function createdData() {

    }
}
