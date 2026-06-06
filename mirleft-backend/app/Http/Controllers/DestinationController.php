<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::query()->where('status', 'active');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('overview', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->filled('region')) {
            $query->where('region', 'like', '%' . $request->region . '%');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $sortBy = $request->get('sort_by', 'popular');
        if ($sortBy === 'rating') {
            $query->orderByDesc('average_rating');
        } elseif ($sortBy === 'newest') {
            $query->latest();
        } else {
            $query->orderByDesc('views_count');
        }

        return response()->json($query->withCount(['properties', 'restaurants', 'activities'])->paginate($request->integer('per_page', 12)));
    }

    public function show(string $slug)
    {
        $destination = Destination::where('slug', $slug)
            ->with([
                'photos',
                'reviews' => fn($q) => $q->where('status', 'approved')->with('user')->latest(),
                'properties' => fn($q) => $q->where('status', 'active')->latest()->limit(8),
                'restaurants' => fn($q) => $q->where('status', 'active')->latest()->limit(8),
                'activities' => fn($q) => $q->where('status', 'active')->latest()->limit(8),
            ])
            ->firstOrFail();

        $destination->increment('views_count');

        $distribution = $destination->reviews()
            ->selectRaw('rating, count(*) as total')
            ->where('status', 'approved')
            ->groupBy('rating')
            ->pluck('total', 'rating');

        return response()->json([
            'destination' => $destination,
            'rating_distribution' => $distribution,
            'seo' => [
                'title' => $destination->meta_title ?: $destination->name . ' - Mirleft Travel Guide',
                'description' => $destination->meta_description ?: Str::limit(strip_tags((string) $destination->overview), 160),
                'og_image' => $destination->og_image ?: $destination->cover_image,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:destinations,slug',
            'short_intro' => 'nullable|string|max:500',
            'overview' => 'nullable|string',
            'best_time_to_visit' => 'nullable|string',
            'weather' => 'nullable|string',
            'transportation' => 'nullable|string',
            'budget_tips' => 'nullable|string',
            'region' => 'nullable|string|max:120',
            'type' => 'nullable|string|max:120',
            'location' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:120',
            'featured' => 'nullable|boolean',
            'status' => 'nullable|string|max:50',
            'cover_image' => 'nullable|image|max:5120',
            'gallery.*' => 'nullable|image|max:5120',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = Storage::disk('public')->url($request->file('cover_image')->store('destinations/covers', 'public'));
            $validated['og_image'] = $validated['cover_image'];
        }

        $destination = Destination::create($validated);

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $index => $file) {
                $url = Storage::disk('public')->url($file->store('destinations/gallery', 'public'));
                $destination->photos()->create([
                    'url' => $url,
                    'order' => $index,
                    'is_cover' => false,
                ]);
            }
        }

        return response()->json(['message' => 'Destination created', 'data' => $destination], 201);
    }

    public function update(Request $request, int $id)
    {
        $destination = Destination::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:destinations,slug,' . $destination->id,
            'short_intro' => 'nullable|string|max:500',
            'overview' => 'nullable|string',
            'best_time_to_visit' => 'nullable|string',
            'weather' => 'nullable|string',
            'transportation' => 'nullable|string',
            'budget_tips' => 'nullable|string',
            'region' => 'nullable|string|max:120',
            'type' => 'nullable|string|max:120',
            'location' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:120',
            'featured' => 'nullable|boolean',
            'status' => 'nullable|string|max:50',
            'cover_image' => 'nullable|image|max:5120',
            'gallery.*' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = Storage::disk('public')->url($request->file('cover_image')->store('destinations/covers', 'public'));
            $validated['og_image'] = $validated['cover_image'];
        }

        $destination->update($validated);

        if ($request->hasFile('gallery')) {
            $currentOrder = (int) $destination->photos()->max('order') + 1;
            foreach ($request->file('gallery') as $file) {
                $url = Storage::disk('public')->url($file->store('destinations/gallery', 'public'));
                $destination->photos()->create([
                    'url' => $url,
                    'order' => $currentOrder++,
                    'is_cover' => false,
                ]);
            }
        }

        return response()->json(['message' => 'Destination updated', 'data' => $destination->fresh('photos')]);
    }

    public function destroy(int $id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();
        return response()->json(['message' => 'Destination deleted']);
    }
}
