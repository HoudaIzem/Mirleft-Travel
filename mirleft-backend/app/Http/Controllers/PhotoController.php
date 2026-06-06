<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhotoRequest;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function store(StorePhotoRequest $request)
    {
        $this->authorize('create', Photo::class);

        $validated = $request->validated();

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads/photos', 'public');
            $validated['url'] = Storage::disk('public')->url($path);
        }

        if (empty($validated['url'])) {
            return response()->json(['message' => 'Either url or file is required'], 422);
        }

        $validated['user_id'] = $request->user()->id;
        $photo = Photo::create($validated);

        return response()->json($photo, 201);
    }

    public function destroy($id)
    {
        $photo = Photo::findOrFail($id);
        $this->authorize('delete', $photo);

        if ($photo->url && str_contains($photo->url, '/storage/')) {
            $relative = str_replace(Storage::disk('public')->url(''), '', $photo->url);
            Storage::disk('public')->delete(ltrim($relative, '/'));
        }

        $photo->delete();

        return response()->json(['message' => 'Photo deleted']);
    }

    public function update(Request $request, $id)
    {
        $photo = Photo::findOrFail($id);
        $this->authorize('update', $photo);

        $validated = $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_cover' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $photo->update($validated);

        return response()->json($photo);
    }
}
