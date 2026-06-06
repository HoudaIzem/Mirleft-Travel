<?php

namespace Tests\Feature;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacationRentalTest extends TestCase
{
    use RefreshDatabase;

    public function test_vacation_rentals_endpoint_returns_villas_and_guesthouses(): void
    {
        Property::factory()->create(['type' => 'hotel', 'status' => 'active', 'name' => 'City Hotel']);
        Property::factory()->create(['type' => 'villa', 'status' => 'active', 'name' => 'Beach Villa']);
        Property::factory()->create(['type' => 'guesthouse', 'status' => 'active', 'name' => 'Cozy Guesthouse']);

        $response = $this->getJson('/api/vacation-rentals');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
}
