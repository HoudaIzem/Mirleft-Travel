<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_toggle_favorite(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['status' => 'active']);

        $add = $this->actingAs($user, 'sanctum')->postJson('/api/favorites/toggle', [
            'favorable_id' => $property->id,
            'favorable_type' => Property::class,
        ]);

        $add->assertStatus(200)->assertJson(['is_favorite' => true]);

        $remove = $this->actingAs($user, 'sanctum')->postJson('/api/favorites/toggle', [
            'favorable_id' => $property->id,
            'favorable_type' => Property::class,
        ]);

        $remove->assertStatus(200)->assertJson(['is_favorite' => false]);
    }

    public function test_user_can_list_grouped_favorites(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['status' => 'active']);

        Favorite::create([
            'user_id' => $user->id,
            'favorable_id' => $property->id,
            'favorable_type' => Property::class,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/favorites');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'properties');
    }

    public function test_user_cannot_delete_another_users_favorite(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $property = Property::factory()->create();

        $favorite = Favorite::create([
            'user_id' => $owner->id,
            'favorable_id' => $property->id,
            'favorable_type' => Property::class,
        ]);

        $this->actingAs($other, 'sanctum')
            ->deleteJson("/api/favorites/{$favorite->id}")
            ->assertStatus(403);
    }
}
