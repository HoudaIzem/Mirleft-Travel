<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Models\Restaurant;
use App\Support\ClearsHomeCache;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    use ClearsHomeCache;

    public function index(Request $request)
    {
        $query = Restaurant::with(['destination', 'amenities'])->where('status', 'active');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('address_full', 'like', "%{$search}%");
            });
        }

        // Filter by cuisine type
        if ($request->has('cuisine') && $request->cuisine) {
            $query->where('cuisine_type', 'like', "%{$request->cuisine}%");
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', "%{$request->location}%");
        }
        if ($request->filled('destination_id')) {
            $query->where('destination_id', $request->destination_id);
        }

        // Filter by price range
        if ($request->has('price_range') && $request->price_range) {
            $query->where('price_range', $request->price_range);
        }

        // Filter by rating
        if ($request->has('min_rating') && $request->min_rating) {
            $query->where('average_rating', '>=', $request->min_rating);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'latest');
        if ($sortBy === 'rating' || $sortBy === 'highest_rated') {
            $query->orderBy('average_rating', 'desc');
        } elseif ($sortBy === 'popular') {
            $query->orderByDesc('views_count');
        } else {
            $query->latest();
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $restaurants = $query->paginate($perPage);

        return response()->json($restaurants);
    }

    public function store(StoreRestaurantRequest $request)
    {
        $this->authorize('create', Restaurant::class);

        $restaurant = Restaurant::create($request->validated());
        $this->clearHomeCache();

        return response()->json(['message' => 'Restaurant created successfully!', 'data' => $restaurant], 201);
    }

    public function show($id)
    {
        $restaurant = Restaurant::with(['reviews.user', 'photos', 'amenities', 'favorites', 'destination'])->findOrFail($id);
        $restaurant->increment('views_count');
        return response()->json($restaurant);
    }

    public function update(UpdateRestaurantRequest $request, $id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $this->authorize('update', $restaurant);

        $restaurant->update($request->validated());
        $this->clearHomeCache();

        return response()->json(['message' => 'Restaurant updated successfully', 'data' => $restaurant]);
    }

    public function destroy($id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $this->authorize('delete', $restaurant);
        $restaurant->delete();
        $this->clearHomeCache();

        return response()->json(['message' => 'Restaurant deleted']);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $cuisine = $request->get('cuisine', '');

        $restaurants = Restaurant::where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('location', 'like', "%{$query}%");
            });

        if ($cuisine) {
            $restaurants->where('cuisine_type', 'like', "%{$cuisine}%");
        }

        $results = $restaurants->limit(10)->get();

        return response()->json(['results' => $results]);
    }
}
