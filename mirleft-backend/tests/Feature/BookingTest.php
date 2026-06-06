<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_booking(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['capacity' => 4, 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/bookings', [
            'property_id' => $property->id,
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'check_in' => now()->addDays(3)->toDateString(),
            'check_out' => now()->addDays(6)->toDateString(),
            'guests' => 2,
            'total_price' => 450,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.property_id', $property->id);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->id,
            'property_id' => $property->id,
            'status' => 'pending',
        ]);
    }

    public function test_booking_rejects_conflicting_dates(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['status' => 'active']);

        $checkIn = now()->addDays(5)->toDateString();
        $checkOut = now()->addDays(8)->toDateString();

        Booking::factory()->create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'status' => 'confirmed',
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/api/bookings', [
            'property_id' => $property->id,
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guests' => 2,
            'total_price' => 450,
        ])->assertStatus(422);
    }

    public function test_user_can_cancel_future_booking(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(12)->toDateString(),
            'status' => 'pending',
        ]);

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/bookings/{$booking->id}/cancel")
            ->assertStatus(200);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
        ]);
    }
}
