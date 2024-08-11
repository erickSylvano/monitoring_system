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
        Schema::table('statuses', function (Blueprint $table) {
            $table->timestamp('last_updated_at')->nullable()->after('updated_at');
        });
    }

    public function down()
    {
        Schema::table('statuses', function (Blueprint $table) {
            $table->dropColumn('last_updated_at');
        });
    }
};
