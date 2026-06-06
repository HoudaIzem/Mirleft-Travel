<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $properties = [
            [
                'name' => 'Maison Mirleft Boutique Hotel',
                'type' => 'hotel',
                'price' => '1200',
                'location' => 'Mirleft Center',
                'address_full' => 'Avenue Mohamed V, Mirleft 82500',
                'latitude' => 29.6395,
                'longitude' => -9.5487,
                'description' => 'Elegant boutique hotel overlooking the Atlantic Ocean. Features traditional Moroccan design with modern amenities.',
                'capacity' => 40,
                'phone' => '+212 5228-61611',
                'email' => 'info@maisonmirleft.com',
                'status' => 'active',
                'average_rating' => 4.5,
                'image' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
            ],
            [
                'name' => 'Riad Mirleft Paradise',
                'type' => 'riad',
                'price' => '850',
                'location' => 'Old Medina',
                'address_full' => 'Derb El Baraka, Medina, Mirleft',
                'latitude' => 29.6412,
                'longitude' => -9.5512,
                'description' => 'Charming traditional riad with courtyard. Intimate atmosphere, perfect for couples.',
                'capacity' => 24,
                'phone' => '+212 5228-61800',
                'email' => 'riad@mirleft-paradise.com',
                'status' => 'active',
                'average_rating' => 4.7,
                'image' => 'https://images.unsplash.com/photo-1560185007-dc669b3ed1ac?w=800&q=80',
            ],
            [
                'name' => 'Ocean View Villa Mirleft',
                'type' => 'villa',
                'price' => '2000',
                'location' => 'Beachfront',
                'address_full' => 'Route Côtière, Mirleft Beach',
                'latitude' => 29.6378,
                'longitude' => -9.5625,
                'description' => 'Luxurious private villa with stunning ocean views. Private beach access.',
                'capacity' => 8,
                'phone' => '+212 5228-62000',
                'email' => 'villa@oceanviewmirleft.com',
                'status' => 'active',
                'average_rating' => 4.8,
                'image' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
}
