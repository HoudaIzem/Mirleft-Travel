<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'latitude')) $table->decimal('latitude', 10, 8)->nullable();
            if (!Schema::hasColumn('activities', 'longitude')) $table->decimal('longitude', 11, 8)->nullable();
            if (!Schema::hasColumn('activities', 'average_rating')) $table->decimal('average_rating', 3, 2)->default(0);
            if (!Schema::hasColumn('activities', 'reviews_count')) $table->integer('reviews_count')->default(0);
            if (!Schema::hasColumn('activities', 'category')) $table->string('category')->nullable();
            if (!Schema::hasColumn('activities', 'difficulty_level')) $table->string('difficulty_level')->nullable();
            if (!Schema::hasColumn('activities', 'duration')) $table->string('duration')->nullable();
            if (!Schema::hasColumn('activities', 'price')) $table->decimal('price', 10, 2)->nullable();
            if (!Schema::hasColumn('activities', 'phone')) $table->string('phone')->nullable();
            if (!Schema::hasColumn('activities', 'email')) $table->string('email')->nullable();
            if (!Schema::hasColumn('activities', 'address_full')) $table->text('address_full')->nullable();
            if (!Schema::hasColumn('activities', 'description')) $table->text('description')->nullable();
            if (!Schema::hasColumn('activities', 'status')) $table->enum('status', ['active', 'inactive', 'seasonal'])->default('active');
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'latitude')) {
                $table->dropColumn([
                    'latitude',
                    'longitude',
                    'average_rating',
                    'reviews_count',
                    'category',
                    'difficulty_level',
                    'duration',
                    'price',
                    'phone',
                    'email',
                    'address_full',
                    'description',
                    'status'
                ]);
            }
        });
    }
};
