<?php

namespace App\Console\Commands;

use App\Models\Destination;
use App\Models\Property;
use Illuminate\Console\Command;

class UpdateBookingProperties extends Command
{
    protected $signature = 'app:update-booking-properties';
    protected $description = 'Update Booking.com properties with proper data';

    public function handle()
    {
        $this->info('🔄 تحديث البيانات من Booking.com...');

        $mirleftId = Destination::where('slug', 'mirleft')->first()?->id ?? 1;

        $properties = Property::whereNull('destination_id')
            ->orWhere('destination_id', $mirleftId)
            ->get();

        $this->info("✅ وجدنا {$properties->count()} فندق للتحديث");

        foreach ($properties as $property) {
            $this->info("➡️  {$property->name}");

            // استخراج التقييم من الوصف
            $rating = $this->extractRating($property->description);

            // تنظيف الوصف
            $cleanDescription = $this->cleanDescription($property->description);

            // إضافة سعر تقديري
            $price = $this->estimatePrice($property->name, $rating);

            // تنظيف رابط الصورة
            $cleanImage = $this->cleanImageUrl($property->image);

            // تحديد النوع
            $type = $this->determineType($property->name);

            $property->update([
                'rating' => $rating,
                'average_rating' => $rating,
                'price' => round($price),
                'image' => $cleanImage,
                'description' => $cleanDescription,
                'type' => $type,
                'status' => 'active',
                'destination_id' => $mirleftId,
                'reviews_count' => $this->extractReviewCount($property->description),
                'latitude' => 30.6700 + (mt_rand(0, 100) / 10000),
                'longitude' => -9.6350 + (mt_rand(0, 100) / 10000),
            ]);

            $this->info("   ✅ تقييم: {$rating} | سعر: {$price} | نوع: {$type}");
        }

        $this->info('🎉 تم تحديث جميع الفنادق!');
    }

    private function extractRating($description)
    {
        if (!$description) return 4.5;

        // الحالة الخاصة: "Avec une note de 9,29,2Fabuleux"
        if (preg_match('/(\d)[,.](\d)\1[,.]\2/', $description, $matches)) {
            $rating = floatval($matches[1] . '.' . $matches[2]);
            return min(10, max(1, $rating));
        }

        // الحالة الخاصة: "Avec une note de 9,2Fabuleux"
        if (preg_match('/(\d+)[,.](\d)(?:Fabuleux|Exceptionnel|Très bien|Superbe)/', $description, $matches)) {
            $rating = floatval($matches[1] . '.' . $matches[2]);
            return min(10, max(1, $rating));
        }

        // الحالة العامة: أي رقم مع فاصلة
        if (preg_match('/(\d+)[,.](\d)/', $description, $matches)) {
            $rating = floatval($matches[1] . '.' . $matches[2]);
            return min(10, max(1, $rating));
        }

        return 4.5;
    }

    private function cleanDescription($description)
    {
        if (!$description) return 'فندق رائع في Mirleft مع إطلالات جميلة.';

        // إزالة أجزاء التقييم
        $clean = preg_replace('/Avec une note de [\d,.]+/', '', $description);
        $clean = preg_replace('/Fabuleux|Exceptionnel|Très bien|Superbe/', '', $clean);
        $clean = preg_replace('/\d+\s+expériences\s+vécues/', '', $clean);
        $clean = trim($clean);

        if (empty($clean)) {
            return 'فندق رائع في Mirleft مع إطلالات جميلة على البحر.';
        }

        // ترجمة مبسطة إذا كانت فرنسية
        $translations = [
            'Fabuleux' => 'رائع',
            'Exceptionnel' => 'استثنائي',
            'Très bien' => 'جيد جداً',
            'Superbe' => 'ممتاز',
            'expériences vécues' => 'تجربة',
        ];

        return str_replace(array_keys($translations), array_values($translations), $clean);
    }

    private function estimatePrice($name, $rating)
    {
        $basePrice = 200;

        // زيادة السعر حسب التقييم
        $basePrice += ($rating * 30);

        // زيادة السعر حسب الكلمات في الاسم
        if (str_contains(strtolower($name), 'villa')) $basePrice += 200;
        if (str_contains(strtolower($name), 'luxury')) $basePrice += 300;
        if (str_contains(strtolower($name), 'pool')) $basePrice += 150;
        if (str_contains(strtolower($name), 'beach')) $basePrice += 100;
        if (str_contains(strtolower($name), 'ocean')) $basePrice += 100;
        if (str_contains(strtolower($name), 'sea')) $basePrice += 100;
        if (str_contains(strtolower($name), 'apt')) $basePrice -= 50;
        if (str_contains(strtolower($name), 'apartment')) $basePrice -= 50;
        if (str_contains(strtolower($name), 'hostel')) $basePrice -= 100;
        if (str_contains(strtolower($name), 'guest')) $basePrice -= 30;

        return max(100, min(1000, $basePrice));
    }

    private function cleanImageUrl($image)
    {
        if (!$image) return 'https://images.unsplash.com/photo-1560185007-6e8f83735b90?w=800';

        // إزالة backticks ومسافات
        $clean = trim(str_replace('`', '', $image));
        return $clean;
    }

    private function determineType($name)
    {
        $nameLower = strtolower($name);

        if (str_contains($nameLower, 'villa')) return 'villa';
        if (str_contains($nameLower, 'apt')) return 'apartment';
        if (str_contains($nameLower, 'apartment')) return 'apartment';
        if (str_contains($nameLower, 'hostel')) return 'hostel';
        if (str_contains($nameLower, 'guest')) return 'guesthouse';
        if (str_contains($nameLower, 'riad')) return 'riad';
        if (str_contains($nameLower, 'hotel')) return 'hotel';
        if (str_contains($nameLower, 'house')) return 'house';

        return 'apartment';
    }

    private function extractReviewCount($description)
    {
        if (!$description) return rand(10, 200);

        if (preg_match('/(\d+)\s+expériences/', $description, $matches)) {
            return intval($matches[1]);
        }

        return rand(10, 200);
    }
}
