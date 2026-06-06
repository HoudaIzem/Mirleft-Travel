<?php

namespace App\Console\Commands;

use App\Models\Property;
use Illuminate\Console\Command;

class FixPropertyImages extends Command
{
    protected $signature = 'app:fix-property-images';
    protected $description = 'Fix property image URLs';

    public function handle()
    {
        $this->info('🔧 Fixing property images...');
        $properties = Property::all();

        $count = 0;
        foreach ($properties as $property) {
            if ($property->image) {
                // تنظيف الرابط: نحذف الـ backticks و المسافات
                $cleanImage = trim($property->image, "` \t\n\r\0\x0B");

                if ($cleanImage !== $property->image) {
                    $property->image = $cleanImage;
                    $property->save();
                    $this->info("✅ Fixed: {$property->name}");
                    $count++;
                }
            }
        }

        $this->info("🎉 Done! Fixed {$count} properties!");
    }
}
