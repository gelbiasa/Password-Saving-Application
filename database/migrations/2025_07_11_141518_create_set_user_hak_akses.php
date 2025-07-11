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
        Schema::create('set_user_hak_akses', function (Blueprint $table) {
            $table->id('set_user_hak_akses_id'); // Primary key dengan nama set_user_hak_akses_id
            $table->unsignedBigInteger('fk_m_hak_akses'); // Foreign key ke tabel m_hak_akses
            $table->unsignedBigInteger('fk_m_user'); // Foreign key ke tabel m_user
            $table->tinyInteger('isDeleted')->default(0);
            $table->string('created_by', 30)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->string('updated_by', 30)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('deleted_by', 30)->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Foreign key constraints
            $table->foreign('fk_m_hak_akses')->references('hak_akses_id')->on('m_hak_akses')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('fk_m_user')->references('user_id')->on('m_user')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('set_user_hak_akses');
    }
};
