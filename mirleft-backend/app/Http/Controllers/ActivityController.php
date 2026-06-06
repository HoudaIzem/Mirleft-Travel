<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Support\ClearsHomeCache;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    use ClearsHomeCache;

    public function index(Request $request)
    {
        $query = Activity::with(['destination', 'amenities'])->where('status', 'active');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('address_full', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', "%{$request->location}%");
        }
        if ($request->filled('destination_id')) {
            $query->where('destination_id', $request->destination_id);
        }

        // Filter by difficulty
        if ($request->has('difficulty') && $request->difficulty) {
            $query->where('difficulty_level', $request->difficulty);
        }

        // Filter by price range
        if ($request->has('min_price') && $request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price') && $request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by rating
        if ($request->has('min_rating') && $request->min_rating) {
            $query->where('average_rating', '>=', $request->min_rating);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'latest');
        if ($sortBy === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sortBy === 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif ($sortBy === 'rating' || $sortBy === 'highest_rated') {
            $query->orderBy('average_rating', 'desc');
        } elseif ($sortBy === 'lowest_price') {
            $query->orderBy('price', 'asc');
        } elseif ($sortBy === 'highest_price') {
            $query->orderBy('price', 'desc');
        } elseif ($sortBy === 'popular') {
            $query->orderByDesc('views_count');
        } else {
            $query->latest();
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $activities = $query->paginate($perPage);

        return response()->json($activities);
    }

    public function store(StoreActivityRequest $request)
    {
        $this->authorize('create', Activity::class);

        $activity = Activity::create($request->validated());
        $this->clearHomeCache();

        return response()->json(['message' => 'Activity created successfully!', 'data' => $activity], 201);
    }

    public function show($id)
    {
        $activity = Activity::with(['reviews.user', 'photos', 'amenities', 'favorites', 'destination'])->findOrFail($id);
        $activity->increment('views_count');
        return response()->json($activity);
    }

    public function update(UpdateActivityRequest $request, $id)
    {
        $activity = Activity::findOrFail($id);
        $this->authorize('update', $activity);

        $activity->update($request->validated());
        $this->clearHomeCache();

        return response()->json(['message' => 'Activity updated successfully', 'data' => $activity]);
    }

    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $this->authorize('delete', $activity);
        $activity->delete();
        $this->clearHomeCache();

        return response()->json(['message' => 'Activity deleted']);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $category = $request->get('category', '');

        $activities = Activity::where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('location', 'like', "%{$query}%");
            });

        if ($category) {
            $activities->where('category', $category);
        }

        $results = $activities->limit(10)->get();

        return response()->json(['results' => $results]);
    }
}
