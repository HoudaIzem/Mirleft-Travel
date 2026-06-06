<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminStatisticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_fetch_statistics(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/statistics')
            ->assertStatus(200)
            ->assertJsonStructure([
                'totals' => ['users', 'properties', 'restaurants', 'activities', 'reviews', 'destinations'],
                'bookings_by_status',
                'reviews_by_status',
            ]);
    }
}
