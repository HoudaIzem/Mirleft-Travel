<?php

namespace Database\Factories;

use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DestinationFactory extends Factory
{
    protected $model = Destination::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->city().' Coast';

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'short_intro' => $this->faker->sentence(),
            'overview' => $this->faker->paragraph(),
            'region' => 'Souss-Massa',
            'type' => 'coastal',
            'location' => 'Mirleft, Morocco',
            'category' => 'beaches',
            'featured' => false,
            'status' => 'active',
        ];
    }
}
