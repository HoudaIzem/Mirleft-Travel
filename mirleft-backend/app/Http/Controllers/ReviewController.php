<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request)
    {
        $user = $request->user();
        $this->authorize('create', Review::class);

        $validated = $request->validated();

        $reviewableClass = $validated['reviewable_type'];
        $reviewable = $reviewableClass::find($validated['reviewable_id']);

        if (!$reviewable) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Check if user already reviewed this item
        $existingReview = Review::where('user_id', $user->id)
            ->where('reviewable_type', $validated['reviewable_type'])
            ->where('reviewable_id', $validated['reviewable_id'])
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You already reviewed this item'], 409);
        }

        $review = $reviewable->reviews()->create([
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'title' => isset($validated['title']) ? strip_tags($validated['title']) : null,
            'text' => Str::limit(strip_tags($validated['text']), 2000),
            'status' => 'pending',
            'images' => $validated['images'] ?? null,
        ]);

        // Update average rating
        $this->updateAverageRating($reviewable);

        return response()->json(['message' => 'Review added successfully!', 'data' => $review], 201);
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'reviewable_type' => 'required|string|in:App\\Models\\Property,App\\Models\\Restaurant,App\\Models\\Activity,App\\Models\\Destination',
            'reviewable_id' => 'required|integer',
            'page' => 'nullable|integer|min:1',
            'sort' => 'nullable|in:newest,highest,lowest',
        ]);

        $reviewableClass = $validated['reviewable_type'];
        $reviewable = $reviewableClass::find($validated['reviewable_id']);

        if (!$reviewable) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $reviews = $reviewable->reviews()->where('status', 'approved')
            ->with('user')
            ->when(($validated['sort'] ?? 'newest') === 'highest', fn($q) => $q->orderByDesc('rating'))
            ->when(($validated['sort'] ?? 'newest') === 'lowest', fn($q) => $q->orderBy('rating'))
            ->when(($validated['sort'] ?? 'newest') === 'newest', fn($q) => $q->latest())
            ->paginate(10);

        return response()->json($reviews);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $this->authorize('update', $review);

        $validated = $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'text' => 'nullable|string|max:2000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'nullable|string|max:1000',
        ]);

        if (isset($validated['title'])) {
            $validated['title'] = strip_tags($validated['title']);
        }
        if (isset($validated['text'])) {
            $validated['text'] = Str::limit(strip_tags($validated['text']), 2000);
        }
        $validated['status'] = 'pending';

        $review->update($validated);

        // Update average rating
        $reviewable = $review->reviewable;
        $this->updateAverageRating($reviewable);

        return response()->json(['message' => 'Review updated successfully', 'data' => $review]);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $this->authorize('delete', $review);

        $reviewable = $review->reviewable;
        $review->delete();

        // Update average rating
        $this->updateAverageRating($reviewable);

        return response()->json(['message' => 'Review deleted']);
    }

    private function updateAverageRating($item)
    {
        $avgRating = $item->reviews()->where('status', 'approved')->avg('rating');
        $count = $item->reviews()->where('status', 'approved')->count();

        $item->update([
            'average_rating' => round($avgRating, 2),
            'reviews_count' => $count,
        ]);
    }
}
