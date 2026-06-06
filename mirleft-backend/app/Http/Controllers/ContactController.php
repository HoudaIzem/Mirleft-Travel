<?php

namespace App\Http\Controllers;

use App\Jobs\SendContactNotification;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $user = auth()->user();
        $validated['user_id'] = $user?->id;

        $contact = Contact::create($validated);
        SendContactNotification::dispatch($contact);

        return response()->json([
            'message' => 'Your message has been sent successfully',
            'contact' => $contact,
        ], 201);
    }

    public function index()
    {
        // Admin only
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $contacts = Contact::latest()->paginate(20);
        return response()->json($contacts);
    }

    public function show($id)
    {
        $contact = Contact::findOrFail($id);

        // Update status to read
        if ($contact->status === 'new') {
            $contact->update(['status' => 'read']);
        }

        return response()->json($contact);
    }

    public function reply(Request $request, $id)
    {
        // Admin only
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'response' => 'required|string',
        ]);

        $contact = Contact::findOrFail($id);
        $contact->update([
            'response' => $validated['response'],
            'status' => 'replied',
        ]);

        return response()->json(['message' => 'Reply sent', 'contact' => $contact]);
    }
}
