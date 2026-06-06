<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // WiFi, Pool, Parking, AC, etc
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('amenitizables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->morphs('amenitizable'); // amenitizable_id, amenitizable_type
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenitizables');
        Schema::dropIfExists('amenities');
    }
};
