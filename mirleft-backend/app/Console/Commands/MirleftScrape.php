<?php

namespace App\Console\Commands;

use App\Models\Destination;
use App\Models\Property;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class MirleftScrape extends Command
{
    protected $signature = 'mirleft:scrape {--skip-node : Import hotels.json without running Node}';

    protected $description = 'Run the Mirleft data scraper and import properties from hotels.json';

    public function handle(): int
    {
        $this->info('Starting Mirleft scraper process...');

        $scraperPath = realpath(base_path('../scraper'));
        if ($scraperPath === false) {
            $this->error('Scraper directory not found at ../scraper');

            return self::FAILURE;
        }

        $scriptPath = $this->resolveScript($scraperPath);
        $jsonPath = $scraperPath.DIRECTORY_SEPARATOR.'hotels.json';

        if (! $this->option('skip-node')) {
            if ($scriptPath === null) {
                $this->warn('No scraper script found; importing existing hotels.json if present.');
            } else {
                $this->info('Running '.basename($scriptPath).'...');
                $process = new Process(['node', basename($scriptPath)], $scraperPath);
                $process->setTimeout(300);

                try {
                    $process->mustRun(function ($type, $buffer) {
                        $this->output->write($buffer);
                    });
                } catch (ProcessFailedException $e) {
                    $this->error('Node scraper process failed: '.$e->getMessage());

                    if (! File::exists($jsonPath)) {
                        return self::FAILURE;
                    }

                    $this->warn('Continuing with existing hotels.json after Node failure.');
                }
            }
        }

        if (! File::exists($jsonPath)) {
            $this->error("Scraped output file not found at: {$jsonPath}");

            return self::FAILURE;
        }

        $hotels = json_decode(File::get($jsonPath), true);
        if (! is_array($hotels)) {
            $this->error('Failed to parse hotels.json.');

            return self::FAILURE;
        }

        $destination = Destination::where('slug', 'mirleft-center')->first();
        $destinationId = $destination?->id;

        $insertedCount = 0;
        $updatedCount = 0;

        foreach ($hotels as $hotel) {
            if (empty($hotel['name'])) {
                continue;
            }

            $property = Property::updateOrCreate(
                ['name' => $hotel['name']],
                [
                    'price' => $hotel['price'] ?? '150',
                    'image' => $hotel['image'] ?? null,
                    'location' => $hotel['location'] ?? 'Mirleft, Morocco',
                    'description' => $hotel['description'] ?? 'Accommodation in Mirleft.',
                    'type' => $hotel['type'] ?? 'hotel',
                    'status' => $hotel['status'] ?? 'active',
                    'destination_id' => $destinationId,
                    'average_rating' => $hotel['rating'] ?? 4.0,
                    'reviews_count' => $hotel['reviews_count'] ?? 10,
                ]
            );

            if ($property->wasRecentlyCreated) {
                $insertedCount++;
            } else {
                $updatedCount++;
            }
        }

        $this->info('Scraper import completed successfully.');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total processed', count($hotels)],
                ['Newly created', $insertedCount],
                ['Updated existing', $updatedCount],
            ]
        );

        return self::SUCCESS;
    }

    private function resolveScript(string $scraperPath): ?string
    {
        foreach (['scrape_local.js', 'scrape.js'] as $script) {
            $full = $scraperPath.DIRECTORY_SEPARATOR.$script;
            if (File::exists($full)) {
                return $full;
            }
        }

        return null;
    }
}
