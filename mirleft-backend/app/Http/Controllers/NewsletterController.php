<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:newsletters,email',
        ]);

        $user = auth()->user();

        $newsletter = Newsletter::create([
            'email' => $validated['email'],
            'user_id' => $user?->id,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Successfully subscribed to newsletter',
            'newsletter' => $newsletter,
        ], 201);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $newsletter = Newsletter::where('email', $validated['email'])->firstOrFail();
        $newsletter->update(['is_active' => false]);

        return response()->json(['message' => 'Unsubscribed from newsletter']);
    }

    public function index()
    {
        // Admin only
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $newsletters = Newsletter::where('is_active', true)->paginate(50);
        return response()->json($newsletters);
    }
}
