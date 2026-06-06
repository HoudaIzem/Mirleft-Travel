<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'destination_id')) {
                $table->foreignId('destination_id')->nullable()->constrained('destinations')->nullOnDelete();
                $table->unsignedBigInteger('views_count')->default(0);
                $table->index(['destination_id', 'average_rating']);
            }
        });

        Schema::table('restaurants', function (Blueprint $table) {
            if (!Schema::hasColumn('restaurants', 'destination_id')) {
                $table->foreignId('destination_id')->nullable()->constrained('destinations')->nullOnDelete();
                $table->unsignedBigInteger('views_count')->default(0);
                $table->index(['destination_id', 'average_rating']);
            }
        });

        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'destination_id')) {
                $table->foreignId('destination_id')->nullable()->constrained('destinations')->nullOnDelete();
                $table->unsignedBigInteger('views_count')->default(0);
                $table->index(['destination_id', 'average_rating']);
            }
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'destination_id')) {
                $table->dropForeign(['destination_id']);
                $table->dropColumn(['destination_id', 'views_count']);
            }
        });
        Schema::table('restaurants', function (Blueprint $table) {
            if (Schema::hasColumn('restaurants', 'destination_id')) {
                $table->dropForeign(['destination_id']);
                $table->dropColumn(['destination_id', 'views_count']);
            }
        });
        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'destination_id')) {
                $table->dropForeign(['destination_id']);
                $table->dropColumn(['destination_id', 'views_count']);
            }
        });
    }
};
