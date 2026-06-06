<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Destination;
use App\Models\Property;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return response()->json(Cache::remember('home_payload', 300, function () {
            return [
                'featured_destinations' => Destination::where('status', 'active')
                    ->where('featured', true)
                    ->orderByDesc('average_rating')
                    ->limit(6)
                    ->get(),
                'featured_hotels' => Property::where('status', 'active')
                    ->orderByDesc('average_rating')
                    ->limit(6)
                    ->get(),
                'featured_restaurants' => Restaurant::where('status', 'active')
                    ->orderByDesc('average_rating')
                    ->limit(6)
                    ->get(),
                'featured_activities' => Activity::where('status', 'active')
                    ->orderByDesc('average_rating')
                    ->limit(6)
                    ->get(),
                'travel_recommendations' => [
                    'Best season for surfing: September to April.',
                    'Try local seafood tajine at ocean-view restaurants.',
                    'Plan a day trip between Mirleft and Legzira Beach.',
                ],
            ];
        }));
    }

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:1|max:120',
        ]);

        $q = $request->get('q');

        $properties = Property::where('status', 'active')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%");
            })
            ->limit(8)
            ->get();

        $restaurants = Restaurant::where('status', 'active')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%")
                    ->orWhere('cuisine_type', 'like', "%{$q}%");
            })
            ->limit(8)
            ->get();

        $activities = Activity::where('status', 'active')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%")
                    ->orWhere('category', 'like', "%{$q}%");
            })
            ->limit(8)
            ->get();
        $destinations = Destination::where('status', 'active')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('overview', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%")
                    ->orWhere('region', 'like', "%{$q}%");
            })
            ->limit(8)
            ->get();

        return response()->json([
            'query' => $q,
            'properties' => $properties,
            'restaurants' => $restaurants,
            'activities' => $activities,
            'destinations' => $destinations,
            'suggestions' => $destinations->pluck('name')
                ->merge($properties->pluck('name'))
                ->merge($restaurants->pluck('name'))
                ->merge($activities->pluck('title'))
                ->unique()
                ->values()
                ->take(10),
            'total' => $properties->count() + $restaurants->count() + $activities->count() + $destinations->count(),
        ]);
    }
}
