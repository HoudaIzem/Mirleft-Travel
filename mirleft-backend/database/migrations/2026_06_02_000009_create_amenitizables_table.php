<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('amenitizables');
        Schema::create('amenitizables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('amenity_id')->constrained('amenities')->onDelete('cascade');
            $table->unsignedBigInteger('amenitizable_id');
            $table->string('amenitizable_type');
            $table->index(['amenitizable_id', 'amenitizable_type'], 'amenitizable_idx');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenitizables');
    }
};
?>
