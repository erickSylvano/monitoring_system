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
        Schema::table('hosts', function (Blueprint $table) {
            $table->string('hostname', 100)->nullable()->change();
            $table->ipAddress('ip_address')->nullable()->change();
            $table->set('os',['Windows', 'Linux'])->nullable()->change();
            $table->string('username', 100)->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->unsignedBigInteger('connexion_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosts', function (Blueprint $table) {
            $table->string('hostname', 100)->change();
            $table->ipAddress('ip_address')->change();
            $table->set('os',['Windows', 'Linux'])->change();
            $table->string('username', 100)->change();
            $table->string('password')->change();
            $table->unsignedBigInteger('connexion_id')->change();
        });
    }
};
