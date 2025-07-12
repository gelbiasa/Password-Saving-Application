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
        Schema::create('m_kategori_password', function (Blueprint $table) {
            $table->id('m_kategori_password_id'); 
            $table->string('kp_kode', 10)->unique();
            $table->string('kp_nama', 100);
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
        Schema::dropIfExists('m_kategori_password');
    }
};
