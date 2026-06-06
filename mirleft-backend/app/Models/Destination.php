<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'short_intro',
        'overview',
        'best_time_to_visit',
        'weather',
        'transportation',
        'budget_tips',
        'region',
        'type',
        'location',
        'category',
        'cover_image',
        'featured',
        'views_count',
        'average_rating',
        'reviews_count',
        'status',
        'meta_title',
        'meta_description',
        'og_image',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'average_rating' => 'float',
    ];

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable')->orderBy('order');
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'favorable');
    }
}
