<?php

namespace App\Policies;

use App\Models\Restaurant;
use App\Models\User;

class RestaurantPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Restaurant $restaurant): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Restaurant $restaurant): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Restaurant $restaurant): bool
    {
        return $user->role === 'admin';
    }
}
