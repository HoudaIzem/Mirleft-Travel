<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Booking $booking): bool
    {
        return $user->role === 'admin' || $booking->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return ! $user->banned_at;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->role === 'admin' || $booking->user_id === $user->id;
    }
}
