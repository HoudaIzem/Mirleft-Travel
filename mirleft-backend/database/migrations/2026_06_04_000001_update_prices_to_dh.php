<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->change();
        });
        Schema::table('restaurants', function (Blueprint $table) {
            if (!Schema::hasColumn('restaurants', 'price')) {
                $table->decimal('price', 10, 2)->nullable();
            }
        });
        Schema::table('activities', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('price')->change();
        });
        Schema::table('restaurants', function (Blueprint $table) {
            if (Schema::hasColumn('restaurants', 'price')) {
                $table->dropColumn('price');
            }
        });
        Schema::table('activities', function (Blueprint $table) {
            $table->string('price')->change();
        });
    }
};
