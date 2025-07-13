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
        Schema::create('m_hak_akses', function (Blueprint $table) {
            $table->id('m_hak_akses_id'); // Primary key dengan nama hak_akses_id
            $table->string('hak_akses_kode', 20);
            $table->string('hak_akses_nama', 50);
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
        Schema::dropIfExists('m_hak_akses');
    }
};
