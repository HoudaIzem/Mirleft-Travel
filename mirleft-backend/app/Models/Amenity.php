<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = ['name', 'icon', 'description'];

    public function amenitizable()
    {
        return $this->morphTo();
    }

    public function properties()
    {
        return $this->morphedByMany(Property::class, 'amenitizable');
    }

    public function restaurants()
    {
        return $this->morphedByMany(Restaurant::class, 'amenitizable');
    }

    public function activities()
    {
        return $this->morphedByMany(Activity::class, 'amenitizable');
    }
}
