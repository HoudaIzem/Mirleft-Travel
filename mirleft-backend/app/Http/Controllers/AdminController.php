<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\Property;
use App\Models\Restaurant;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function statistics()
    {
        return response()->json([
            'totals' => [
                'users' => User::count(),
                'properties' => Property::count(),
                'restaurants' => Restaurant::count(),
                'activities' => Activity::count(),
                'reviews' => Review::count(),
                'destinations' => Destination::count(),
            ],
            'bookings_by_status' => Booking::query()
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'reviews_by_status' => Review::query()
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
        ]);
    }

    public function dashboard()
    {
        return response()->json([
            'users' => User::count(),
            'destinations' => Destination::count(),
            'properties' => Property::count(),
            'restaurants' => Restaurant::count(),
            'activities' => Activity::count(),
            'reviews' => Review::count(),
            'recent_activity' => Review::with('user')->latest()->limit(10)->get(),
            'top_rated_destinations' => Destination::orderByDesc('average_rating')->limit(5)->get(),
            'most_viewed_places' => [
                'destinations' => Destination::orderByDesc('views_count')->limit(5)->get(),
                'hotels' => Property::orderByDesc('views_count')->limit(5)->get(),
                'restaurants' => Restaurant::orderByDesc('views_count')->limit(5)->get(),
                'activities' => Activity::orderByDesc('views_count')->limit(5)->get(),
            ],
        ]);
    }

    public function users()
    {
        return response()->json(
            User::latest()->paginate(20)
        );
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'role' => 'nullable|in:user,admin',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string|max:1200',
            'social_links' => 'nullable|string|max:1000',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function reviews()
    {
        return response()->json(
            Review::with('user')->latest()->paginate(20)
        );
    }

    public function moderateReview(Request $request, int $id)
    {
        $review = Review::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
        ]);
        $review->update(['status' => $validated['status']]);
        return response()->json(['message' => 'Review updated', 'data' => $review]);
    }

    public function banUser(int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['banned_at' => now()]);
        return response()->json(['message' => 'User banned']);
    }

    public function unbanUser(int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['banned_at' => null]);
        return response()->json(['message' => 'User unbanned']);
    }
}
