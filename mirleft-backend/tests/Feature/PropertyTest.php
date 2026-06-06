<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_properties(): void
    {
        Property::factory()->count(3)->create();

        $response = $this->getJson('/api/properties');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_property_as_admin(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $propertyData = [
            'name' => 'Test Property',
            'price' => '100',
            'rating' => '4.5',
            'image' => 'http://example.com/image.jpg',
            'description' => 'A beautiful test property.',
            'location' => 'Test Location',
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/properties', $propertyData);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Property created successfully!']);
        $this->assertDatabaseHas('properties', ['name' => 'Test Property']);
    }

    public function test_cannot_create_property_as_unauthenticated_user(): void
    {
        $propertyData = [
            'name' => 'Test Property',
            'price' => '100',
            'rating' => '4.5',
            'image' => 'http://example.com/image.jpg',
            'description' => 'A beautiful test property.',
            'location' => 'Test Location',
        ];

        $response = $this->postJson('/api/properties', $propertyData);

        $response->assertStatus(401);
    }
}
