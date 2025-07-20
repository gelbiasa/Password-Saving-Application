<?php

namespace App\Models\ManagePengguna;

use App\Models\TraitsModel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class UserModel extends Authenticatable
{
    use TraitsModel;

    protected $table = 'm_user';
    protected $primaryKey = 'm_user_id';
    public $incrementing = true;
    protected $keyType = 'int';
    
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

    protected $hidden = ['password', 'remember_token'];
    
    protected $casts = [
        'password' => 'hashed',
        'isBloked' => 'integer'
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->fillable = array_merge($this->fillable, $this->getCommonFields());
    }

    // Override method untuk Laravel Auth - perbaiki cara mengakses primary key
    public function getAuthIdentifierName()
    {
        return $this->getKeyName(); // Menggunakan getKeyName() yang otomatis mengambil primary key
    }

    public function getAuthIdentifier()
    {
        return $this->getKey(); // Menggunakan getKey() yang otomatis mengambil nilai primary key
    }

    public function getAuthPassword()
    {
        return $this->password;
    }

    // Method untuk mendapatkan ID user dengan cara yang aman
    public function getId()
    {
        return $this->getAttribute($this->getKeyName());
    }

    // Relasi untuk mendapatkan hak akses pengguna
    public function hakAkses()
    {
        return $this->belongsToMany(
            HakAksesModel::class,
            'set_user_hak_akses',
            'fk_m_user',
            'fk_m_hak_akses',
            'm_user_id',
            'm_hak_akses_id'
        )
        ->where('m_hak_akses.isDeleted', 0)
        ->where('set_user_hak_akses.isDeleted', 0)
        ->select('m_hak_akses.*'); // Pastikan data dari tabel m_hak_akses yang diambil
    }

    // Method untuk mendapatkan semua hak akses pengguna
    public function getAllHakAkses()
    {
        return $this->hakAkses()->get();
    }

    // Method untuk mengecek apakah user diblokir
    public function isBlocked()
    {
        return $this->isBloked == 1;
    }

    // Method untuk mendapatkan username login (jika diperlukan)
    public function getAuthPasswordName()
    {
        return 'password';
    }

    // Override method untuk remember token jika tidak digunakan
    public function getRememberToken()
    {
        return null;
    }

    public function setRememberToken($value)
    {
        // Tidak melakukan apa-apa jika remember token tidak digunakan
    }

    public function getRememberTokenName()
    {
        return null;
    }
}