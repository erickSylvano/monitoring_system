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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(\App\Models\Host::class)->constrained()->cascadeOnDelete();
            $table->boolean('active')->default(True);
            $table->string('source_id', 4096);
            $table->set('schedule_type', ['Full', 'Incremental']);
            $table->time('schedule_time');
            $table->date('schedule_date');
            $table->set('state', ['Jamais lancée', 'Préparation', 'En cours', 'Compression','Terminée', 'Suspendue','Désactivée']);
            $table->set('compression', ['Aucun', 'Normale', 'Forte']);
            $table->tinyInteger('priority')->default(2);
            $table->date('full_backup_date');
            $table->string('source_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
