<?php

namespace App\Console\Commands;

use App\Models\Destination;
use App\Models\Property;
use Illuminate\Console\Command;

class SetExactRatings extends Command
{
    protected $signature = 'app:set-exact-ratings';
    protected $description = 'Set exact ratings from the Booking.com data';

    public function handle()
    {
        $this->info('🔄 Setting exact ratings...');

        $mirleftId = Destination::where('slug', 'mirleft')->first()?->id ?? 1;

        // بيانات دقيقة من Booking.com
        $hotelData = [
            ['name' => 'Les Bains de Mirleft', 'rating' => 8.7, 'reviews' => 217, 'type' => 'hotel', 'price' => 385],
            ['name' => 'DreamCatcher Homes', 'rating' => 9.3, 'reviews' => 242, 'type' => 'apartment', 'price' => 435],
            ['name' => 'Greenwave Ecolodge', 'rating' => 9.1, 'reviews' => 276, 'type' => 'lodge', 'price' => 385],
            ['name' => 'Sallys', 'rating' => 9.3, 'reviews' => 86, 'type' => 'apartment', 'price' => 385],
            ['name' => 'Ocean Dunes House', 'rating' => 8.5, 'reviews' => 186, 'type' => 'house', 'price' => 435],
            ['name' => 'Mirleft Tayought Guest House', 'rating' => 9.4, 'reviews' => 248, 'type' => 'guesthouse', 'price' => 405],
            ['name' => 'Aftas Trip', 'rating' => 8.3, 'reviews' => 407, 'type' => 'apartment', 'price' => 385],
            ['name' => 'Amwaj Apt - Beachfront Paradise Charming 1BR with Ocean Views', 'rating' => 9.6, 'reviews' => 18, 'type' => 'apartment', 'price' => 485],
            ['name' => 'Sable de Mirleft Luxury Apartment', 'rating' => 9.1, 'reviews' => 93, 'type' => 'apartment', 'price' => 485],
            ['name' => 'Les Étoiles du Ksar', 'rating' => 8.3, 'reviews' => 164, 'type' => 'hotel', 'price' => 385],
            ['name' => 'Mirleft Trip', 'rating' => 9.1, 'reviews' => 121, 'type' => 'apartment', 'price' => 385],
            ['name' => 'Villa vue mer Mirleft - ménage et Cuisinière à mi-temps', 'rating' => 8.7, 'reviews' => 16, 'type' => 'villa', 'price' => 685],
            ['name' => 'Infinity View 4 Bed Pool Villa', 'rating' => 10.0, 'reviews' => 3, 'type' => 'villa', 'price' => 885],
            ['name' => 'Be My Guest', 'rating' => 9.6, 'reviews' => 144, 'type' => 'guesthouse', 'price' => 405],
            ['name' => 'Amwaj Apt - Wake to Waves Stylish 1-Bedroom by the Shore', 'rating' => 9.6, 'reviews' => 17, 'type' => 'apartment', 'price' => 485],
            ['name' => 'Amazigh Home', 'rating' => 9.7, 'reviews' => 23, 'type' => 'apartment', 'price' => 535],
            ['name' => 'Mirleft Hostel', 'rating' => 9.2, 'reviews' => 51, 'type' => 'hostel', 'price' => 235],
            ['name' => 'Dania Surf House', 'rating' => 9.8, 'reviews' => 50, 'type' => 'house', 'price' => 485],
            ['name' => 'Asunfou - Escapade paisible et authentique', 'rating' => 9.5, 'reviews' => 19, 'type' => 'apartment', 'price' => 485],
            ['name' => 'Tilily Apartment', 'rating' => 9.5, 'reviews' => 26, 'type' => 'apartment', 'price' => 485],
            ['name' => 'Tayafut Apartments & Terrace by Surfleft Morocco', 'rating' => 9.4, 'reviews' => 32, 'type' => 'apartment', 'price' => 485],
            ['name' => '4 bedroom Villa Pool Sea Views 9 person', 'rating' => 9.7, 'reviews' => 3, 'type' => 'villa', 'price' => 885],
            ['name' => 'Mirleft Beach', 'rating' => 8.3, 'reviews' => 68, 'type' => 'apartment', 'price' => 435],
            ['name' => 'Amwaj Apt - Golden Sands and Blue Waves Beach Escape', 'rating' => 9.2, 'reviews' => 30, 'type' => 'apartment', 'price' => 485],
            ['name' => 'Dar diafa samira', 'rating' => 9.1, 'reviews' => 50, 'type' => 'apartment', 'price' => 485],
        ];

        $count = 0;
        foreach ($hotelData as $data) {
            $property = Property::where('name', $data['name'])->where('destination_id', $mirleftId)->first();
            if ($property) {
                $property->update([
                    'rating' => $data['rating'],
                    'average_rating' => $data['rating'],
                    'reviews_count' => $data['reviews'],
                    'type' => $data['type'],
                    'price' => $data['price'],
                    'status' => 'active',
                ]);
                $this->info("✅ {$data['name']}: {$data['rating']} ({$data['reviews']} reviews)");
                $count++;
            } else {
                $this->warn("❌ {$data['name']} not found, creating...");
                Property::create([
                    'name' => $data['name'],
                    'rating' => $data['rating'],
                    'average_rating' => $data['rating'],
                    'reviews_count' => $data['reviews'],
                    'type' => $data['type'],
                    'price' => $data['price'],
                    'description' => 'فندق رائع في Mirleft مع إطلالات جميلة.',
                    'location' => 'Mirleft, Morocco',
                    'status' => 'active',
                    'destination_id' => $mirleftId,
                    'image' => 'https://images.unsplash.com/photo-1560185007-6e8f83735b90?w=800',
                    'views_count' => rand(100, 500),
                    'latitude' => 30.6700 + (mt_rand(0, 100) / 10000),
                    'longitude' => -9.6350 + (mt_rand(0, 100) / 10000),
                ]);
                $count++;
            }
        }

        $this->info("🎉 Done! Updated {$count} properties.");
    }
}
