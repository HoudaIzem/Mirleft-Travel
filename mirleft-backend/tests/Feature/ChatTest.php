<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Restaurant;
use App\Services\GeminiChatService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_chat_returns_fallback_when_api_key_missing(): void
    {
        config(['gemini.api_key' => null]);

        $response = $this->postJson('/api/chat', [
            'message' => 'Best hotels in Mirleft?',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'mode' => 'fallback',
            ])
            ->assertJsonStructure(['reply']);
    }

    public function test_chat_uses_gemini_when_configured(): void
    {
        config(['gemini.api_key' => 'test-key']);

        Property::factory()->create([
            'name' => 'Surf Riad',
            'status' => 'active',
            'type' => 'riad',
            'location' => 'Mirleft',
            'price' => 300,
            'average_rating' => 4.5,
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Try Surf Riad in Mirleft for great Atlantic views.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'message' => 'Tell me about Mirleft.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'mode' => 'gemini',
                'reply' => 'Try Surf Riad in Mirleft for great Atlantic views.',
            ]);
    }

    public function test_chat_validates_message(): void
    {
        $this->postJson('/api/chat', [])->assertStatus(422);
    }

    public function test_gemini_service_builds_context(): void
    {
        Property::factory()->create([
            'name' => 'Context Hotel',
            'status' => 'active',
        ]);

        config(['gemini.api_key' => null]);

        $service = app(GeminiChatService::class);
        $result = $service->reply('Hello');

        $this->assertSame('fallback', $result['mode']);
        $this->assertNotEmpty($result['reply']);
    }

    public function test_chat_fallback_lists_local_restaurants(): void
    {
        config(['gemini.api_key' => null]);

        Restaurant::factory()->create([
            'name' => 'Ocean Fish House',
            'status' => 'active',
            'location' => 'Mirleft Center',
            'cuisine_type' => 'seafood',
            'price_range' => '$$',
            'average_rating' => 4.8,
        ]);

        $response = $this->postJson('/api/chat', [
            'message' => 'Top seafood restaurants in Mirleft?',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'mode' => 'local',
            ]);

        $this->assertStringContainsString(
            'Ocean Fish House',
            $response->json('reply')
        );
    }
}
