<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'user_id',
        'url',
        'alt_text',
        'description',
        'order',
        'is_cover',
        'photoable_id',
        'photoable_type',
    ];

    protected $casts = [
        'is_cover' => 'boolean',
        'order' => 'integer',
    ];

    public function photoable()
    {
        return $this->morphTo();
    }
}
