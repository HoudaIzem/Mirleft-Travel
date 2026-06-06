<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'rating',
        'image',
        'description',
        'location',
        'type',
        'latitude',
        'longitude',
        'average_rating',
        'reviews_count',
        'amenities_description',
        'capacity',
        'phone',
        'email',
        'address_full',
        'status',
        'destination_id',
        'views_count',
        'booking_link',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'average_rating' => 'float',
        'price' => 'float',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'favorable');
    }

    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable')->orderBy('order');
    }

    public function amenities()
    {
        return $this->morphToMany(Amenity::class, 'amenitizable');
    }

    public function getCoverPhoto()
    {
        return $this->photos()->where('is_cover', true)->first() ?? $this->photos()->first();
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
