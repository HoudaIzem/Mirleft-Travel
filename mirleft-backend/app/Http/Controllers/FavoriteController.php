<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $favorites = $user->favorites()->with('favorable')->get();

        $properties = [];
        $restaurants = [];
        $activities = [];
        $destinations = [];

        foreach ($favorites as $favorite) {
            if ($favorite->favorable_type === 'App\\Models\\Property') {
                $properties[] = $favorite->favorable;
            } elseif ($favorite->favorable_type === 'App\\Models\\Restaurant') {
                $restaurants[] = $favorite->favorable;
            } elseif ($favorite->favorable_type === 'App\\Models\\Activity') {
                $activities[] = $favorite->favorable;
            } elseif ($favorite->favorable_type === 'App\\Models\\Destination') {
                $destinations[] = $favorite->favorable;
            }
        }

        return response()->json([
            'properties' => $properties,
            'restaurants' => $restaurants,
            'activities' => $activities,
            'destinations' => $destinations,
        ]);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'favorable_id' => 'required|integer',
            'favorable_type' => 'required|string|in:App\Models\Property,App\Models\Restaurant,App\Models\Activity,App\Models\Destination',
        ]);

        $user = auth()->user();
        $favorite = $user->favorites()
            ->where('favorable_id', $validated['favorable_id'])
            ->where('favorable_type', $validated['favorable_type'])
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Removed from favorites', 'is_favorite' => false]);
        } else {
            $user->favorites()->create([
                'favorable_id' => $validated['favorable_id'],
                'favorable_type' => $validated['favorable_type'],
            ]);
            return response()->json(['message' => 'Added to favorites', 'is_favorite' => true]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'favorable_id' => 'required|integer',
            'favorable_type' => 'required|string|in:App\Models\Property,App\Models\Restaurant,App\Models\Activity,App\Models\Destination',
        ]);

        $user = auth()->user();

        // Check if already favorited
        $exists = $user->favorites()
            ->where('favorable_id', $validated['favorable_id'])
            ->where('favorable_type', $validated['favorable_type'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in favorites'], 409);
        }

        $favorite = $user->favorites()->create($validated);

        return response()->json([
            'message' => 'Added to favorites',
            'favorite' => $favorite,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $favorite = Favorite::findOrFail($id);
        $this->authorize('delete', $favorite);

        $favorite->delete();

        return response()->json(['message' => 'Removed from favorites']);
    }

    public function isFavorite(Request $request)
    {
        $validated = $request->validate([
            'favorable_id' => 'required|integer',
            'favorable_type' => 'required|string',
        ]);

        $user = auth()->user();
        $isFavorite = $user->favorites()
            ->where('favorable_id', $validated['favorable_id'])
            ->where('favorable_type', $validated['favorable_type'])
            ->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }
}
