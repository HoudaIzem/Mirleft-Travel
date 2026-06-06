<?php

namespace Tests\Feature;

use App\Models\Photo;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PhotoTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_photo_by_url(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/photos', [
            'url' => 'https://example.com/photo.jpg',
            'photoable_id' => $property->id,
            'photoable_type' => Property::class,
            'alt_text' => 'Ocean view',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('photos', [
            'user_id' => $user->id,
            'photoable_id' => $property->id,
        ]);
    }

    public function test_user_can_upload_photo_file(): void
    {
        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for fake image uploads.');
        }

        Storage::fake('public');
        $user = User::factory()->create();
        $property = Property::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/photos', [
            'file' => UploadedFile::fake()->image('room.jpg'),
            'photoable_id' => $property->id,
            'photoable_type' => Property::class,
        ]);

        $response->assertStatus(201);
        $this->assertNotEmpty($response->json('url'));
        Storage::disk('public')->assertExists('uploads/photos/room.jpg');
    }

    public function test_user_cannot_delete_another_users_photo(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $photo = Photo::create([
            'user_id' => $owner->id,
            'url' => 'https://example.com/x.jpg',
            'photoable_id' => 1,
            'photoable_type' => Property::class,
        ]);

        $this->actingAs($other, 'sanctum')
            ->deleteJson("/api/photos/{$photo->id}")
            ->assertStatus(403);
    }
}
