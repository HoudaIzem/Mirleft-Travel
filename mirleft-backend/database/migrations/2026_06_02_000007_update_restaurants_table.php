<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            if (!Schema::hasColumn('restaurants', 'latitude')) $table->decimal('latitude', 10, 8)->nullable();
            if (!Schema::hasColumn('restaurants', 'longitude')) $table->decimal('longitude', 11, 8)->nullable();
            if (!Schema::hasColumn('restaurants', 'average_rating')) $table->decimal('average_rating', 3, 2)->default(0);
            if (!Schema::hasColumn('restaurants', 'reviews_count')) $table->integer('reviews_count')->default(0);
            if (!Schema::hasColumn('restaurants', 'cuisine_type')) $table->string('cuisine_type')->nullable();
            if (!Schema::hasColumn('restaurants', 'phone')) $table->string('phone')->nullable();
            if (!Schema::hasColumn('restaurants', 'email')) $table->string('email')->nullable();
            if (!Schema::hasColumn('restaurants', 'address_full')) $table->text('address_full')->nullable();
            if (!Schema::hasColumn('restaurants', 'price_range')) $table->string('price_range')->nullable();
            if (!Schema::hasColumn('restaurants', 'description')) $table->text('description')->nullable();
            if (!Schema::hasColumn('restaurants', 'status')) $table->enum('status', ['active', 'inactive', 'closed'])->default('active');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            if (Schema::hasColumn('restaurants', 'latitude')) {
                $table->dropColumn([
                    'latitude',
                    'longitude',
                    'average_rating',
                    'reviews_count',
                    'cuisine_type',
                    'phone',
                    'email',
                    'address_full',
                    'price_range',
                    'description',
                    'status'
                ]);
            }
        });
    }
};
