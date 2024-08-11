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
        Schema::create('pools', function (Blueprint $table) {
            $table->id();
            $table->datetime('date');
            $table->set('state', ['Jamais lancée', 'Préparation', 'En cours', 'Compression','Terminée', 'Suspendue','Désactivée']);
            $table->string('progression');
            $table->timestamps();
            $table->foreignIdFor(\App\Models\Task::class);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pools');
    }
};
