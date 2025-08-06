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
        Schema::create('m_detail_password', function (Blueprint $table) {
            $table->id('m_detail_password');
            $table->unsignedBigInteger('fk_m_kategori_password');
            $table->unsignedBigInteger('fk_m_user'); 
            $table->string('dp_nama_username', 255); 
            $table->string('dp_nama_password', 255);
            $table->string('dp_pin', 255); 
            $table->string('dp_keterangan', 255);
            $table->tinyInteger('isDeleted')->default(0);
            $table->string('created_by', 30)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->string('updated_by', 30)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('deleted_by', 30)->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Foreign key constraints
            $table->foreign('fk_m_kategori_password')->references('m_kategori_password_id')->on('m_kategori_password')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('fk_m_user')->references('m_user_id')->on('m_user')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_detail_password');
    }
};
