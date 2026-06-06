<?php

namespace Database\Factories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantFactory extends Factory
{
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Restaurant',
            'cuisine_type' => $this->faker->word(),
            'status' => 'active',
            'location' => $this->faker->city(),
            'image' => $this->faker->imageUrl(),
            'description' => $this->faker->paragraph(),
            'price_range' => $this->faker->randomElement(['$', '$$', '$$$']),
            'phone' => $this->faker->phoneNumber(),
            'opening_hours' => '9 AM - 10 PM',
        ];
    }
}
