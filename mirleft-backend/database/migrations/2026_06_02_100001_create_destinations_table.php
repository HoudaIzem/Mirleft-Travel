<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('short_intro')->nullable();
            $table->text('overview')->nullable();
            $table->text('best_time_to_visit')->nullable();
            $table->text('weather')->nullable();
            $table->text('transportation')->nullable();
            $table->text('budget_tips')->nullable();
            $table->string('region')->nullable();
            $table->string('type')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('status')->default('active');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->timestamps();

            $table->index(['featured', 'status']);
            $table->index(['region', 'type']);
            $table->index('views_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
