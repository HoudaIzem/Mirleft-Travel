<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends Controller
{
    public function index()
    {
        $amenities = Amenity::all();
        return response()->json($amenities);
    }

    public function store(Request $request)
    {
        // Admin only
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:amenities',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $amenity = Amenity::create($validated);

        return response()->json($amenity, 201);
    }

    public function update(Request $request, $id)
    {
        // Admin only
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $amenity = Amenity::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|unique:amenities,name,' . $id,
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $amenity->update($validated);

        return response()->json($amenity);
    }

    public function destroy($id)
    {
        // Admin only
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $amenity = Amenity::findOrFail($id);
        $amenity->delete();

        return response()->json(['message' => 'Amenity deleted']);
    }
}
