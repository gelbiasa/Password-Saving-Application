<?php

namespace App\Models\ManagePengguna;

use App\Models\TraitsModel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserModel extends Authenticatable
{
    use TraitsModel, HasFactory;

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

    /**
     * ✅ GET ALL USERS - Untuk manage user page
     */
    public function getAllUsersWithHakAkses()
    {
        try {
            $users = $this->with(['hakAkses'])
                         ->where('isDeleted', 0)
                         ->orderBy('created_at', 'desc')
                         ->get();

            $formattedUsers = $users->map(function($user) {
                return [
                    'm_user_id' => $user->m_user_id,
                    'username' => $user->username,
                    'nama_pengguna' => $user->nama_pengguna,
                    'email_pengguna' => $user->email_pengguna,
                    'alamat_pengguna' => $user->alamat_pengguna,
                    'no_hp_pengguna' => $user->no_hp_pengguna,
                    'jenis_kelamin_pengguna' => $user->jenis_kelamin_pengguna,
                    'foto_profil' => $user->foto_profil,
                    'isBloked' => $user->isBloked,
                    'is_blocked' => $user->isBlocked(),
                    'status' => $user->isBlocked() ? 'Diblokir' : 'Aktif',
                    'status_class' => $user->isBlocked() ? 'blocked' : 'active',
                    'created_at' => $user->created_at,
                    'created_by' => $user->created_by,
                    'updated_at' => $user->updated_at,
                    'updated_by' => $user->updated_by,
                    // ✅ Format hak akses
                    'hak_akses' => $user->hakAkses->map(function($akses) {
                        return [
                            'm_hak_akses_id' => $akses->m_hak_akses_id,
                            'hak_akses_kode' => $akses->hak_akses_kode,
                            'hak_akses_nama' => $akses->hak_akses_nama,
                        ];
                    }),
                    'hak_akses_string' => $user->hakAkses->pluck('hak_akses_nama')->join(', '),
                    'total_hak_akses' => $user->hakAkses->count(),
                    // ✅ Password count untuk user ini
                    'total_passwords' => $this->getUserPasswordCount($user->m_user_id),
                    // ✅ Last login info (bisa dikembangkan nanti)
                    'last_login' => $user->updated_at ? $user->updated_at->diffForHumans() : 'Belum pernah login'
                ];
            });

            return [
                'success' => true,
                'data' => $formattedUsers,
                'total' => $formattedUsers->count()
            ];

        } catch (\Exception $e) {
            Log::error('Error getting all users with hak akses: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memuat data user: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ];
        }
    }

    /**
     * ✅ GET BLOCKED USERS - Untuk melihat user yang diblokir
     */
    public function getBlockedUsers()
    {
        try {
            $blockedUsers = $this->with(['hakAkses'])
                                ->where('isDeleted', 0)
                                ->where('isBloked', 1)
                                ->orderBy('updated_at', 'desc')
                                ->get();

            $formattedUsers = $blockedUsers->map(function($user) {
                return [
                    'm_user_id' => $user->m_user_id,
                    'username' => $user->username,
                    'nama_pengguna' => $user->nama_pengguna,
                    'email_pengguna' => $user->email_pengguna,
                    'isBloked' => $user->isBloked,
                    'status' => 'Diblokir',
                    'blocked_at' => $user->updated_at,
                    'blocked_by' => $user->updated_by,
                    'hak_akses_string' => $user->hakAkses->pluck('hak_akses_nama')->join(', ')
                ];
            });

            return [
                'success' => true,
                'data' => $formattedUsers,
                'total' => $formattedUsers->count()
            ];

        } catch (\Exception $e) {
            Log::error('Error getting blocked users: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memuat data user yang diblokir: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ];
        }
    }

    /**
     * ✅ GET USER BY ID - Untuk detail user
     */
    public function getUserById($id)
    {
        try {
            $user = $this->with(['hakAkses'])
                        ->where('m_user_id', $id)
                        ->where('isDeleted', 0)
                        ->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User tidak ditemukan',
                    'data' => null
                ];
            }

            $formattedUser = [
                'm_user_id' => $user->m_user_id,
                'username' => $user->username,
                'nama_pengguna' => $user->nama_pengguna,
                'email_pengguna' => $user->email_pengguna,
                'alamat_pengguna' => $user->alamat_pengguna,
                'no_hp_pengguna' => $user->no_hp_pengguna,
                'jenis_kelamin_pengguna' => $user->jenis_kelamin_pengguna,
                'foto_profil' => $user->foto_profil,
                'isBloked' => $user->isBloked,
                'is_blocked' => $user->isBlocked(),
                'status' => $user->isBlocked() ? 'Diblokir' : 'Aktif',
                'created_at' => $user->created_at,
                'created_by' => $user->created_by,
                'updated_at' => $user->updated_at,
                'updated_by' => $user->updated_by,
                'hak_akses' => $user->hakAkses->map(function($akses) {
                    return [
                        'm_hak_akses_id' => $akses->m_hak_akses_id,
                        'hak_akses_kode' => $akses->hak_akses_kode,
                        'hak_akses_nama' => $akses->hak_akses_nama,
                    ];
                }),
                'total_passwords' => $this->getUserPasswordCount($user->m_user_id)
            ];

            return [
                'success' => true,
                'data' => $formattedUser
            ];

        } catch (\Exception $e) {
            Log::error('Error getting user by ID: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memuat data user: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * ✅ BLOCK USER - Memblokir user
     */
    public function blockUser($id)
    {
        try {
            DB::beginTransaction();

            $user = $this->where('m_user_id', $id)
                        ->where('isDeleted', 0)
                        ->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User tidak ditemukan'
                ];
            }

            if ($user->isBlocked()) {
                return [
                    'success' => false,
                    'message' => 'User sudah dalam status diblokir'
                ];
            }

            // Update status isBloked menjadi 1
            $user->isBloked = 1;
            $user->save();

            DB::commit();

            Log::info('User blocked successfully', [
                'user_id' => $id,
                'username' => $user->username,
                'blocked_by' => $user->updated_by
            ]);

            return [
                'success' => true,
                'message' => 'User berhasil diblokir',
                'data' => [
                    'user_id' => $user->m_user_id,
                    'username' => $user->username,
                    'nama_pengguna' => $user->nama_pengguna,
                    'status' => 'Diblokir'
                ]
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error blocking user: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memblokir user: ' . $e->getMessage()
            ];
        }
    }

    /**
     * ✅ UNBLOCK USER - Membuka blokir user
     */
    public function unblockUser($id)
    {
        try {
            DB::beginTransaction();

            $user = $this->where('m_user_id', $id)
                        ->where('isDeleted', 0)
                        ->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User tidak ditemukan'
                ];
            }

            if (!$user->isBlocked()) {
                return [
                    'success' => false,
                    'message' => 'User tidak dalam status diblokir'
                ];
            }

            // Update status isBloked menjadi 0
            $user->isBloked = 0;
            $user->save();

            DB::commit();

            Log::info('User unblocked successfully', [
                'user_id' => $id,
                'username' => $user->username,
                'unblocked_by' => $user->updated_by
            ]);

            return [
                'success' => true,
                'message' => 'User berhasil dibuka blokirnya',
                'data' => [
                    'user_id' => $user->m_user_id,
                    'username' => $user->username,
                    'nama_pengguna' => $user->nama_pengguna,
                    'status' => 'Aktif'
                ]
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error unblocking user: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal membuka blokir user: ' . $e->getMessage()
            ];
        }
    }

    /**
     * ✅ GET USER STATISTICS - Untuk dashboard info
     */
    public function getUserStatistics()
    {
        try {
            $totalUsers = $this->where('isDeleted', 0)->count();
            $activeUsers = $this->where('isDeleted', 0)->where('isBloked', 0)->count();
            $blockedUsers = $this->where('isDeleted', 0)->where('isBloked', 1)->count();

            return [
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'blocked_users' => $blockedUsers,
                    'active_percentage' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) : 0,
                    'blocked_percentage' => $totalUsers > 0 ? round(($blockedUsers / $totalUsers) * 100, 2) : 0
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error getting user statistics: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memuat statistik user: ' . $e->getMessage(),
                'data' => []
            ];
        }
    }

    /**
     * ✅ SEARCH USERS - Pencarian user
     */
    public function searchUsers($keyword)
    {
        try {
            $users = $this->with(['hakAkses'])
                         ->where('isDeleted', 0)
                         ->where(function($query) use ($keyword) {
                             $query->where('username', 'LIKE', "%{$keyword}%")
                                   ->orWhere('nama_pengguna', 'LIKE', "%{$keyword}%")
                                   ->orWhere('email_pengguna', 'LIKE', "%{$keyword}%");
                         })
                         ->orderBy('created_at', 'desc')
                         ->get();

            $formattedUsers = $users->map(function($user) {
                return [
                    'm_user_id' => $user->m_user_id,
                    'username' => $user->username,
                    'nama_pengguna' => $user->nama_pengguna,
                    'email_pengguna' => $user->email_pengguna,
                    'isBloked' => $user->isBloked,
                    'is_blocked' => $user->isBlocked(),
                    'status' => $user->isBlocked() ? 'Diblokir' : 'Aktif',
                    'hak_akses_string' => $user->hakAkses->pluck('hak_akses_nama')->join(', '),
                    'total_hak_akses' => $user->hakAkses->count(),
                    'created_at' => $user->created_at
                ];
            });

            return [
                'success' => true,
                'data' => $formattedUsers,
                'total' => $formattedUsers->count(),
                'keyword' => $keyword
            ];

        } catch (\Exception $e) {
            Log::error('Error searching users: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal melakukan pencarian: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ];
        }
    }

    /**
     * ✅ Helper method - Get user password count
     */
    private function getUserPasswordCount($userId)
    {
        try {
            return DB::table('m_detail_password')
                    ->where('fk_m_user', $userId)
                    ->where('isDeleted', 0)
                    ->count();
        } catch (\Exception $e) {
            Log::error('Error getting user password count: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * ✅ GET USER HAK AKSES DETAILS - Untuk menampilkan detail hak akses
     */
    public function getUserHakAksesDetails($userId)
    {
        try {
            $user = $this->with(['hakAkses'])
                        ->where('m_user_id', $userId)
                        ->where('isDeleted', 0)
                        ->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User tidak ditemukan',
                    'data' => []
                ];
            }

            $hakAksesDetails = $user->hakAkses->map(function($akses) {
                return [
                    'm_hak_akses_id' => $akses->m_hak_akses_id,
                    'hak_akses_kode' => $akses->hak_akses_kode,
                    'hak_akses_nama' => $akses->hak_akses_nama,
                    'created_at' => $akses->created_at ?? null,
                    'created_by' => $akses->created_by ?? null
                ];
            });

            return [
                'success' => true,
                'data' => [
                    'user_info' => [
                        'm_user_id' => $user->m_user_id,
                        'username' => $user->username,
                        'nama_pengguna' => $user->nama_pengguna,
                        'email_pengguna' => $user->email_pengguna
                    ],
                    'hak_akses' => $hakAksesDetails,
                    'total_hak_akses' => $hakAksesDetails->count()
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error getting user hak akses details: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memuat detail hak akses: ' . $e->getMessage(),
                'data' => []
            ];
        }
    }
}