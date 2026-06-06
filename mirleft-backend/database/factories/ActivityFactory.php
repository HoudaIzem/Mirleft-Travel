<?php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'category' => $this->faker->randomElement(['Surfing', 'Trekking', 'Paragliding']),
            'duration' => $this->faker->randomElement(['2-4 hours', 'Full day', 'Half day']),
            'image' => $this->faker->imageUrl(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(20, 200),
            'location' => $this->faker->city(),
        ];
    }
}
