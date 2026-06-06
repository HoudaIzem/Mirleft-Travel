<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_restaurants(): void
    {
        Restaurant::factory()->count(3)->create();

        $response = $this->getJson('/api/restaurants');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_restaurant_as_admin(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $restaurantData = [
            'name' => 'Test Restaurant',
            'cuisine' => 'Moroccan',
            'location' => 'Test Location',
            'image' => 'http://example.com/restaurant.jpg',
            'description' => 'A delicious test restaurant.',
            'price_range' => '$$',
            'phone' => '123-456-7890',
            'opening_hours' => '9 AM - 10 PM',
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/restaurants', $restaurantData);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Restaurant created successfully!']);
        $this->assertDatabaseHas('restaurants', ['name' => 'Test Restaurant']);
    }

    public function test_cannot_create_restaurant_as_unauthenticated_user(): void
    {
        $restaurantData = [
            'name' => 'Test Restaurant',
            'cuisine' => 'Moroccan',
            'location' => 'Test Location',
            'image' => 'http://example.com/restaurant.jpg',
            'description' => 'A delicious test restaurant.',
            'price_range' => '$$',
            'phone' => '123-456-7890',
            'opening_hours' => '9 AM - 10 PM',
        ];

        $response = $this->postJson('/api/restaurants', $restaurantData);

        $response->assertStatus(401);
    }
}
