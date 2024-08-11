<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('host_id')->nullable();
            $table->unsignedBigInteger('type_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('reference_value')->nullable();
            $table->string('current_value')->nullable();
            $table->string('state')->nullable();
            $table->string('message')->nullable();
            $table->string('rules')->nullable();
            $table->timestamps();

            // Add foreign key constraints
            $table->foreign('host_id')->references('id')->on('hosts')->onDelete('cascade');
            $table->foreign('type_id')->references('id')->on('types')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('statuses')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('statuses');
    }
};
