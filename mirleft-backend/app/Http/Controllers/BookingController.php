<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Booking::class);

        $bookings = Booking::where('user_id', $request->user()->id)
            ->with('property')
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function store(StoreBookingRequest $request)
    {
        $this->authorize('create', Booking::class);

        $validated = $request->validated();
        $property = Property::findOrFail($validated['property_id']);

        if ($property->capacity && $validated['guests'] > $property->capacity) {
            return response()->json([
                'message' => "The number of guests exceeds the maximum capacity of {$property->capacity} for this property.",
            ], 422);
        }

        $conflictingBooking = Booking::where('property_id', $validated['property_id'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->where('check_in', '>=', $validated['check_in'])
                        ->where('check_in', '<', $validated['check_out']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('check_out', '>', $validated['check_in'])
                        ->where('check_out', '<=', $validated['check_out']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('check_in', '<=', $validated['check_in'])
                        ->where('check_out', '>=', $validated['check_out']);
                });
            })
            ->exists();

        if ($conflictingBooking) {
            return response()->json([
                'message' => 'Property is not available for the selected dates.',
            ], 422);
        }

        $booking = Booking::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $booking->load('property'),
        ], 201);
    }

    public function show($id, Request $request)
    {
        $booking = Booking::where('user_id', $request->user()->id)
            ->with('property')
            ->findOrFail($id);

        $this->authorize('view', $booking);

        return response()->json($booking);
    }

    public function cancel($id, Request $request)
    {
        $booking = Booking::where('user_id', $request->user()->id)->findOrFail($id);
        $this->authorize('cancel', $booking);

        if ($booking->status === 'cancelled') {
            return response()->json(['message' => 'This booking is already cancelled.'], 422);
        }

        if ($booking->check_in <= now()->toDateString()) {
            return response()->json(['message' => 'Cannot cancel a booking that has already started.'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Booking cancelled successfully']);
    }
}
