<?php

namespace Tests\Feature;

use App\Models\Destination;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ScraperCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_scraper_imports_hotels_json(): void
    {
        Destination::factory()->create([
            'slug' => 'mirleft-center',
            'name' => 'Mirleft Center',
        ]);

        $this->artisan('mirleft:scrape', ['--skip-node' => true])
            ->assertExitCode(0);

        $this->assertTrue(Property::where('name', 'Riad Mirleft Ocean')->exists());
    }

    public function test_scraper_command_fails_without_json(): void
    {
        $scraperPath = realpath(base_path('../scraper'));
        $jsonPath = $scraperPath.DIRECTORY_SEPARATOR.'hotels.json.bak';

        if (! $scraperPath || ! File::exists($scraperPath.DIRECTORY_SEPARATOR.'hotels.json')) {
            $this->markTestSkipped('Scraper fixtures not available.');
        }

        File::move(
            $scraperPath.DIRECTORY_SEPARATOR.'hotels.json',
            $jsonPath
        );

        try {
            $this->artisan('mirleft:scrape', ['--skip-node' => true])
                ->assertExitCode(1);
        } finally {
            if (File::exists($jsonPath)) {
                File::move($jsonPath, $scraperPath.DIRECTORY_SEPARATOR.'hotels.json');
            }
        }
    }
}
