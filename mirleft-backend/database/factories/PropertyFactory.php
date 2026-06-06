<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'price' => $this->faker->numberBetween(50, 500),
            'rating' => $this->faker->randomFloat(1, 1, 5),
            'image' => $this->faker->imageUrl(),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'type' => $this->faker->randomElement(['hotel', 'riad', 'villa', 'guesthouse']),
            'status' => 'active',
            'capacity' => 4,
            'average_rating' => $this->faker->randomFloat(1, 3, 5),
        ];
    }
}
