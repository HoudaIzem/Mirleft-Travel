<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_activities(): void
    {
        Activity::factory()->count(3)->create();

        $response = $this->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_activity_as_admin(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $activityData = [
            'title' => 'Test Activity',
            'category' => 'Surfing',
            'duration' => '2-4 hours',
            'image' => 'http://example.com/activity.jpg',
            'description' => 'An exciting test activity.',
            'price' => '50',
            'location' => 'Test Location',
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/activities', $activityData);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Activity created successfully!']);
        $this->assertDatabaseHas('activities', ['title' => 'Test Activity']);
    }

    public function test_cannot_create_activity_as_unauthenticated_user(): void
    {
        $activityData = [
            'title' => 'Test Activity',
            'category' => 'Surfing',
            'duration' => '2-4 hours',
            'image' => 'http://example.com/activity.jpg',
            'description' => 'An exciting test activity.',
            'price' => '50',
            'location' => 'Test Location',
        ];

        $response = $this->postJson('/api/activities', $activityData);

        $response->assertStatus(401);
    }
}
