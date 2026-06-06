<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            ['name' => 'WiFi', 'icon' => 'wifi', 'description' => 'Free WiFi throughout the property'],
            ['name' => 'Pool', 'icon' => 'waves', 'description' => 'Outdoor swimming pool'],
            ['name' => 'Parking', 'icon' => 'car', 'description' => 'Free parking on site'],
            ['name' => 'Air Conditioning', 'icon' => 'wind', 'description' => 'Air conditioning in rooms'],
            ['name' => 'Restaurant', 'icon' => 'utensils', 'description' => 'On-site restaurant'],
            ['name' => 'Bar', 'icon' => 'wine-glass', 'description' => 'Bar and lounge'],
            ['name' => 'Beach Access', 'icon' => 'umbrella-beach', 'description' => 'Direct access to beach'],
            ['name' => 'Gym', 'icon' => 'dumbbell', 'description' => 'Fitness center'],
            ['name' => 'Spa', 'icon' => 'spa', 'description' => 'Spa services available'],
            ['name' => 'Pet Friendly', 'icon' => 'paw', 'description' => 'Pets welcome'],
            ['name' => 'Breakfast Included', 'icon' => 'coffee', 'description' => 'Free breakfast'],
            ['name' => 'Room Service', 'icon' => 'bell', 'description' => '24/7 room service'],
            ['name' => 'Concierge', 'icon' => 'headset', 'description' => 'Concierge service'],
            ['name' => 'Tour Desk', 'icon' => 'map', 'description' => 'Arranges tours and activities'],
            ['name' => 'Kids Club', 'icon' => 'child', 'description' => 'Kids club available'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }
    }
}
