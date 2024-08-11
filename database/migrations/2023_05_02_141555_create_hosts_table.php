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
        Schema::create('hosts', function (Blueprint $table) {
            $table->id();
            $table->string('hostname', 100);
            $table->ipAddress('ip_address');
            $table->set('os',['Windows', 'Linux']);
            $table->string('username', 100);
            $table->string('password');
            $table->string('domain')->nullable();
            $table->text('host_ecdsa_key')->nullable();;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};
