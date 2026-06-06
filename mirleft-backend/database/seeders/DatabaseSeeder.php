<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password123'),
                'role' => 'user',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@mirleft.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password123'),
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => bcrypt('password123'),
                'role' => 'user',
            ]
        );

        Destination::firstOrCreate(
            ['slug' => 'mirleft-center'],
            [
                'name' => 'Mirleft Center',
                'short_intro' => 'Coastal town in southern Morocco known for beaches and surf.',
                'overview' => 'Mirleft combines cliffs, surf spots, local markets, and guest houses.',
                'best_time_to_visit' => 'September to April for surf, spring for mild weather.',
                'weather' => 'Mild Atlantic climate with windy afternoons.',
                'transportation' => 'Accessible from Agadir by road and local taxi connections.',
                'budget_tips' => 'Book guest houses early in high season.',
                'region' => 'Souss-Massa',
                'type' => 'coastal',
                'location' => 'Mirleft, Morocco',
                'category' => 'beaches',
                'featured' => true,
                'status' => 'active',
            ]
        );
    }
}
