<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Destination;
use App\Models\Property;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiChatService
{
    public function reply(string $message, array $history = [], ?string $lang = null): array
    {
        $language = $this->normalizeLanguage($lang);
        $localReply = $this->localAnswer($message, $language);

        if ($localReply !== null) {
            return $localReply;
        }

        $fallback = $this->fallbackResponse($message, $language);
        $apiKey = config('gemini.api_key');

        if (!$apiKey) {
            return $fallback;
        }

        try {
            $prompt = $this->buildPrompt($message, $history, $language);
            $model = config('gemini.model', 'gemini-1.5-flash');
            $timeout = (int) config('gemini.timeout', 30);

            $response = Http::acceptJson()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout($timeout)
                ->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                    [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => $prompt],
                                ],
                            ],
                        ],
                    ]
                );

            if (! $response->successful()) {
                Log::error('Gemini failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return $fallback;
            }

            $reply = data_get($response->json(), 'candidates.0.content.parts.0.text');

            if (! is_string($reply) || trim($reply) === '') {
                return $fallback;
            }

            return [
                'reply' => trim($reply),
                'mode' => 'gemini',
            ];
        } catch (\Throwable $e) {
            Log::error('Gemini exception: ' . $e->getMessage());

            return $fallback;
        }
    }

    private function localAnswer(string $message, string $language): ?array
    {
        $lowerMessage = mb_strtolower($message);

        if ($this->containsAny($lowerMessage, ['restaurant', 'restaurants', 'food', 'seafood', 'fish', 'poisson', 'smek', 'سمك', 'مطعم', 'أكل'])) {
            $restaurants = $this->queryLocalRestaurants($lowerMessage);

            if ($restaurants->isNotEmpty()) {
                return [
                    'reply' => $this->formatRestaurantReply($restaurants, $language),
                    'mode' => 'local',
                ];
            }
        }

        if ($this->containsAny($lowerMessage, ['hotel', 'stay', 'riad'])) {
            $properties = $this->queryLocalProperties();

            if ($properties->isNotEmpty()) {
                return [
                    'reply' => $this->formatPropertyReply($properties, $language),
                    'mode' => 'local',
                ];
            }
        }

        if ($this->containsAny($lowerMessage, ['activity', 'surf', 'trip'])) {
            $activities = $this->queryLocalActivities();

            if ($activities->isNotEmpty()) {
                return [
                    'reply' => $this->formatActivityReply($activities, $language),
                    'mode' => 'local',
                ];
            }
        }

        return null;
    }

    private function buildPrompt(string $message, array $history, string $language): string
    {
        $contextLimit = max(1, (int) config('gemini.context_limit', 10));
        $history = array_slice($history, -$contextLimit);

        $historyLines = collect($history)
            ->map(function ($item) {
                $role = strtolower((string) ($item['role'] ?? 'user'));
                $content = trim((string) ($item['content'] ?? ''));

                if ($content === '') {
                    return null;
                }

                return strtoupper($role) . ': ' . $content;
            })
            ->filter()
            ->implode("\n");

        $travelContext = $this->buildTravelContext();

        $languageInstruction = match ($language) {
            'ar' => 'Respond in Arabic and keep the tone friendly and concise.',
            'fr' => 'Respond in French and keep the tone friendly and concise.',
            default => 'Respond in English and keep the tone friendly and concise.',
        };

        return trim(implode("\n\n", array_filter([
            'You are Mirleft Guide AI, a travel assistant for Mirleft, Morocco.',
            'Only answer with helpful travel guidance about Mirleft, the surrounding coast, and related planning.',
            'If the user asks for unavailable or uncertain details, be honest and suggest the closest useful alternative.',
            $languageInstruction,
            'Local context:',
            $travelContext,
            $historyLines !== '' ? "Conversation history:\n{$historyLines}" : null,
            'User question: ' . $message,
        ])));
    }

    private function buildTravelContext(): string
    {
        $properties = Property::query()
            ->where('status', 'active')
            ->orderByDesc('average_rating')
            ->limit(3)
            ->get(['name', 'location', 'type', 'average_rating', 'price'])
            ->map(fn ($property) => sprintf(
                '%s (%s, %s, rating %s, from %s)',
                $property->name,
                $property->location ?? 'Mirleft',
                $property->type ?? 'stay',
                number_format((float) ($property->average_rating ?? 0), 1),
                $this->formatPrice($property->price)
            ))
            ->implode('; ');

        $restaurants = Restaurant::query()
            ->where('status', 'active')
            ->orderByDesc('average_rating')
            ->limit(3)
            ->get(['name', 'location', 'cuisine', 'average_rating', 'price_range'])
            ->map(fn ($restaurant) => sprintf(
                '%s (%s, %s, rating %s, %s)',
                $restaurant->name,
                $restaurant->location ?? 'Mirleft',
                $restaurant->cuisine ?? 'restaurant',
                number_format((float) ($restaurant->average_rating ?? 0), 1),
                $restaurant->price_range ?: 'price on request'
            ))
            ->implode('; ');

        $activities = Activity::query()
            ->where('status', 'active')
            ->orderByDesc('average_rating')
            ->limit(3)
            ->get(['title', 'location', 'category', 'average_rating', 'price'])
            ->map(fn ($activity) => sprintf(
                '%s (%s, %s, rating %s, from %s)',
                $activity->title,
                $activity->location ?? 'Mirleft',
                $activity->category ?? 'activity',
                number_format((float) ($activity->average_rating ?? 0), 1),
                $this->formatPrice($activity->price)
            ))
            ->implode('; ');

        $destinations = Destination::query()
            ->where('status', 'active')
            ->orderByDesc('average_rating')
            ->limit(3)
            ->get(['name', 'region', 'category', 'average_rating'])
            ->map(fn ($destination) => sprintf(
                '%s (%s, %s, rating %s)',
                $destination->name,
                $destination->region ?? 'Mirleft',
                $destination->category ?? 'destination',
                number_format((float) ($destination->average_rating ?? 0), 1)
            ))
            ->implode('; ');

        return implode("\n", array_filter([
            $properties !== '' ? 'Top stays: ' . $properties : null,
            $restaurants !== '' ? 'Top restaurants: ' . $restaurants : null,
            $activities !== '' ? 'Top activities: ' . $activities : null,
            $destinations !== '' ? 'Top destinations: ' . $destinations : null,
        ]));
    }

    private function fallbackResponse(string $message, string $language): array
    {
        return [
            'reply' => $this->localFallbackReply($message, $language),
            'mode' => 'fallback',
        ];
    }

    private function localFallbackReply(string $message, string $language): string
    {
        $lowerMessage = mb_strtolower($message);
        $restaurantIntent = $this->containsAny($lowerMessage, [
            'restaurant',
            'restaurants',
            'food',
            'seafood',
            'fish',
            'poisson',
            'smek',
            'سمك',
            'مطعم',
            'أكل',
        ]);

        if ($restaurantIntent) {
            $restaurants = Restaurant::query()
                ->where('status', 'active')
                ->when(
                    $this->containsAny($lowerMessage, ['seafood', 'fish', 'poisson', 'smek', 'سمك']),
                    function ($query) {
                        $query->where(function ($nested) {
                            $nested->where('name', 'like', '%fish%')
                                ->orWhere('name', 'like', '%seafood%')
                                ->orWhere('description', 'like', '%fish%')
                                ->orWhere('description', 'like', '%seafood%')
                                ->orWhere('cuisine_type', 'like', '%fish%')
                                ->orWhere('cuisine_type', 'like', '%seafood%');
                        });
                    }
                )
                ->orderByDesc('average_rating')
                ->orderByDesc('views_count')
                ->limit(5)
                ->get(['name', 'location', 'cuisine_type', 'average_rating', 'price_range', 'description']);

            if ($restaurants->isEmpty()) {
                $restaurants = Restaurant::query()
                    ->where('status', 'active')
                    ->orderByDesc('average_rating')
                    ->orderByDesc('views_count')
                    ->limit(5)
                    ->get(['name', 'location', 'cuisine_type', 'average_rating', 'price_range', 'description']);
            }

            if ($restaurants->isNotEmpty()) {
                $intro = match ($language) {
                    'ar' => 'لقيت هاد المطاعم المحلية اللي ممكن تعاونك:',
                    'fr' => 'J’ai trouvé ces restaurants locaux qui peuvent t’aider :',
                    default => 'I found these local restaurants that can help you:',
                };

                $lines = $restaurants->map(function ($restaurant, $index) {
                    $details = array_filter([
                        $restaurant->location ? $restaurant->location : null,
                        $restaurant->cuisine_type ? $restaurant->cuisine_type : null,
                        $restaurant->price_range ? $restaurant->price_range : null,
                        $restaurant->average_rating ? 'rating ' . number_format((float) $restaurant->average_rating, 1) : null,
                    ]);

                    return sprintf(
                        '%d. %s%s',
                        $index + 1,
                        $restaurant->name,
                        $details ? ' - ' . implode(', ', $details) : ''
                    );
                })->implode("\n");

                $closing = match ($language) {
                    'ar' => 'إلا بغيتي، نقدر نفلترهم لك حسب السمك الطري، الثمن، ولا المنطقة.',
                    'fr' => 'Si tu veux, je peux les filtrer par poisson frais, prix ou quartier.',
                    default => 'If you want, I can filter them by fresh fish, price, or area.',
                };

                return trim($intro . "\n" . $lines . "\n" . $closing);
            }
        }

        if (str_contains($lowerMessage, 'hotel') || str_contains($lowerMessage, 'stay') || str_contains($lowerMessage, 'riad')) {
            return match ($language) {
                'ar' => 'عندي اقتراحات ديال الإقامة فميرلفت. قولي ليا الميزانية ديالك ولا المنطقة اللي بغيتي ونعاونك نختار الأنسب.',
                'fr' => 'Je peux t’aider à trouver un bon séjour à Mirleft. Donne-moi ton budget ou la zone que tu préfères.',
                default => 'I can help you find the best stay in Mirleft. Share your budget or preferred area and I will narrow it down.',
            };
        }

        if (str_contains($lowerMessage, 'restaurant') || str_contains($lowerMessage, 'food') || str_contains($lowerMessage, 'seafood')) {
            return match ($language) {
                'ar' => 'يمكنني نقترح عليك مطاعم زوينة فميرلفت. إلا بغيتي مأكولات بحرية أو أكل محلي، عطيني التفضيلات ديالك.',
                'fr' => 'Je peux te suggérer de bons restaurants à Mirleft. Si tu veux des fruits de mer ou de la cuisine locale, dis-moi tes préférences.',
                default => 'I can suggest good restaurants in Mirleft. If you want seafood or local food, tell me your preference.',
            };
        }

        if (str_contains($lowerMessage, 'activity') || str_contains($lowerMessage, 'surf') || str_contains($lowerMessage, 'trip')) {
            return match ($language) {
                'ar' => 'نقدر نعاونك فالأشطة والخرجات من ميرلفت: السرف، الشواطئ، والرحلات النهارية. سولي وباش نعطيك اقتراحات مناسبة.',
                'fr' => 'Je peux t’aider avec les activités et les sorties depuis Mirleft: surf, plages et excursions à la journée.',
                default => 'I can help with activities and day trips from Mirleft: surf, beaches, and local excursions.',
            };
        }

        return match ($language) {
            'ar' => 'أنا المرشد ديال ميرلفت. سولي على الفنادق، المطاعم، الأنشطة، ولا برنامج سفر كامل.',
            'fr' => 'Je suis le guide de Mirleft. Demande-moi des hôtels, restaurants, activités ou un programme complet.',
            default => 'I am your Mirleft travel guide. Ask me about hotels, restaurants, activities, or a full itinerary.',
        };
    }

    private function queryLocalRestaurants(string $lowerMessage)
    {
        return Restaurant::query()
            ->where('status', 'active')
            ->when(
                $this->containsAny($lowerMessage, ['seafood', 'fish', 'poisson', 'smek', 'سمك']),
                function ($query) {
                    $query->where(function ($nested) {
                        $nested->where('name', 'like', '%fish%')
                            ->orWhere('name', 'like', '%seafood%')
                            ->orWhere('description', 'like', '%fish%')
                            ->orWhere('description', 'like', '%seafood%')
                            ->orWhere('cuisine_type', 'like', '%fish%')
                            ->orWhere('cuisine_type', 'like', '%seafood%');
                    });
                }
            )
            ->orderByDesc('average_rating')
            ->orderByDesc('views_count')
            ->limit(5)
            ->get(['name', 'location', 'cuisine_type', 'average_rating', 'price_range', 'description']);
    }

    private function queryLocalProperties()
    {
        return Property::query()
            ->where('status', 'active')
            ->orderByDesc('average_rating')
            ->orderByDesc('views_count')
            ->limit(5)
            ->get(['name', 'location', 'type', 'average_rating', 'price']);
    }

    private function queryLocalActivities()
    {
        return Activity::query()
            ->where('status', 'active')
            ->orderByDesc('average_rating')
            ->orderByDesc('views_count')
            ->limit(5)
            ->get(['title', 'location', 'category', 'average_rating', 'price']);
    }

    private function formatRestaurantReply($restaurants, string $language): string
    {
        $intro = match ($language) {
            'ar' => 'لقيت هاد المطاعم المحلية اللي ممكن تعاونك:',
            'fr' => 'J’ai trouvé ces restaurants locaux qui peuvent t’aider :',
            default => 'I found these local restaurants that can help you:',
        };

        $lines = $restaurants->map(function ($restaurant, $index) {
            $details = array_filter([
                $restaurant->location ? $restaurant->location : null,
                $restaurant->cuisine_type ? $restaurant->cuisine_type : null,
                $restaurant->price_range ? $restaurant->price_range : null,
                $restaurant->average_rating ? 'rating ' . number_format((float) $restaurant->average_rating, 1) : null,
            ]);

            return sprintf(
                '%d. %s%s',
                $index + 1,
                $restaurant->name,
                $details ? ' - ' . implode(', ', $details) : ''
            );
        })->implode("\n");

        $closing = match ($language) {
            'ar' => 'إلا بغيتي، نقدر نفلترهم لك حسب السمك الطري، الثمن، ولا المنطقة.',
            'fr' => 'Si tu veux, je peux les filtrer par poisson frais, prix ou quartier.',
            default => 'If you want, I can filter them by fresh fish, price, or area.',
        };

        return trim($intro . "\n" . $lines . "\n" . $closing);
    }

    private function formatPropertyReply($properties, string $language): string
    {
        $intro = match ($language) {
            'ar' => 'هادي بعض الإقامات اللي لقيت فميرلفت:',
            'fr' => 'Voici quelques séjours que j’ai trouvés à Mirleft :',
            default => 'Here are some stays I found in Mirleft:',
        };

        $lines = $properties->map(function ($property, $index) {
            $details = array_filter([
                $property->location ? $property->location : null,
                $property->type ? $property->type : null,
                $property->price ? $this->formatPrice($property->price) : null,
                $property->average_rating ? 'rating ' . number_format((float) $property->average_rating, 1) : null,
            ]);

            return sprintf(
                '%d. %s%s',
                $index + 1,
                $property->name,
                $details ? ' - ' . implode(', ', $details) : ''
            );
        })->implode("\n");

        return trim($intro . "\n" . $lines);
    }

    private function formatActivityReply($activities, string $language): string
    {
        $intro = match ($language) {
            'ar' => 'هاد الأنشطة اللي لقيت فميرلفت:',
            'fr' => 'Voici les activités que j’ai trouvées à Mirleft :',
            default => 'Here are the activities I found in Mirleft:',
        };

        $lines = $activities->map(function ($activity, $index) {
            $details = array_filter([
                $activity->location ? $activity->location : null,
                $activity->category ? $activity->category : null,
                $activity->price ? $this->formatPrice($activity->price) : null,
                $activity->average_rating ? 'rating ' . number_format((float) $activity->average_rating, 1) : null,
            ]);

            return sprintf(
                '%d. %s%s',
                $index + 1,
                $activity->title,
                $details ? ' - ' . implode(', ', $details) : ''
            );
        })->implode("\n");

        return trim($intro . "\n" . $lines);
    }

    private function containsAny(string $text, array $needles): bool
    {
        foreach ($needles as $needle) {
            if ($needle !== '' && str_contains($text, $needle)) {
                return true;
            }
        }

        return false;
    }

    private function normalizeLanguage(?string $language): string
    {
        $language = strtolower((string) $language);

        if (str_starts_with($language, 'ar')) {
            return 'ar';
        }

        if (str_starts_with($language, 'fr')) {
            return 'fr';
        }

        return 'en';
    }

    private function formatPrice(mixed $price): string
    {
        if ($price === null || $price === '') {
            return 'price on request';
        }

        return is_numeric($price) ? '$' . number_format((float) $price, 2, '.', '') : (string) $price;
    }
}
