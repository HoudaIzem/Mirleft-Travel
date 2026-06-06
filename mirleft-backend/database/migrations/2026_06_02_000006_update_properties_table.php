<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Add new columns
            $table->decimal('latitude', 10, 8)->nullable()->after('location');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->decimal('average_rating', 3, 2)->default(0)->after('rating');
            $table->integer('reviews_count')->default(0)->after('average_rating');
            $table->text('amenities_description')->nullable()->after('description');
            $table->integer('capacity')->nullable()->after('type');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address_full')->nullable();
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'latitude',
                'longitude',
                'average_rating',
                'reviews_count',
                'amenities_description',
                'capacity',
                'phone',
                'email',
                'address_full',
                'status'
            ]);
        });
    }
};
