<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Support\ClearsHomeCache;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    use ClearsHomeCache;

    public function index(Request $request)
    {
        $query = Property::with(['destination', 'amenities'])->where('status', 'active');

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

        // Filter by type (single or comma-separated list)
        if ($request->filled('types')) {
            $types = array_filter(explode(',', $request->types));
            $query->whereIn('type', $types);
        } elseif ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', "%{$request->location}%");
        }
        if ($request->filled('destination_id')) {
            $query->where('destination_id', $request->destination_id);
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
        $properties = $query->paginate($perPage);

        return PropertyResource::collection($properties);
    }

    public function store(StorePropertyRequest $request)
    {
        $this->authorize('create', Property::class);

        $property = Property::create($request->validated());
        $this->clearHomeCache();

        return response()->json(['message' => 'Property created successfully!', 'data' => $property], 201);
    }

    public function show($id)
    {
        $property = Property::with(['reviews.user', 'photos', 'amenities', 'favorites', 'destination'])->findOrFail($id);
        $property->increment('views_count');
        return new PropertyResource($property);
    }

    public function update(UpdatePropertyRequest $request, $id)
    {
        $property = Property::findOrFail($id);
        $this->authorize('update', $property);

        $property->update($request->validated());
        $this->clearHomeCache();

        return response()->json(['message' => 'Property updated successfully', 'data' => $property]);
    }

    public function destroy($id)
    {
        $property = Property::findOrFail($id);
        $this->authorize('delete', $property);
        $property->delete();
        $this->clearHomeCache();

        return response()->json(['message' => 'Property deleted']);
    }

    public function vacationRentals(Request $request)
    {
        $request->merge([
            'types' => $request->get('types', 'villa,guesthouse,riad'),
        ]);

        return $this->index($request);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $type = $request->get('type', '');

        $properties = Property::where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('location', 'like', "%{$query}%");
            });

        if ($type) {
            $properties->where('type', $type);
        }

        $results = $properties->limit(10)->get();

        return response()->json(['results' => $results]);
    }
}
