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
        Schema::table('properties', function (Blueprint $table) {
            $table->index('status');
            $table->index('location');
            $table->index('price');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->index('status');
            $table->index('location');
            $table->index('cuisine_type');
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->index('status');
            $table->index('location');
            $table->index('price');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['location']);
            $table->dropIndex(['price']);
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['location']);
            $table->dropIndex(['cuisine_type']);
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['location']);
            $table->dropIndex(['price']);
            $table->dropIndex(['category']);
        });
    }
};
