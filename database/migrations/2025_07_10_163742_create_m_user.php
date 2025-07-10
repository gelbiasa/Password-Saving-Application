<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('m_user', function (Blueprint $table) {
            $table->id('user_id'); // Primary key dengan nama user_id
            $table->string('username', 50)->unique();
            $table->string('password', 100);
            $table->string('nama_pengguna', 255);
            $table->string('alamat_pengguna', 255);
            $table->string('no_hp_pengguna', 20);
            $table->string('email_pengguna', 100);
            $table->string('jenis_kelamin_pengguna', 100);
            $table->string('foto_profil', 100)->nullable();
            $table->tinyInteger('isBloked')->default(0);
            $table->tinyInteger('isDeleted')->default(0);
            $table->string('created_by', 30)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->string('updated_by', 30)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('deleted_by', 30)->nullable();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_user');
    }
};
