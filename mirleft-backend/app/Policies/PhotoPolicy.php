<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;

class PhotoPolicy
{
    public function create(User $user): bool
    {
        return ! $user->banned_at;
    }

    public function update(User $user, Photo $photo): bool
    {
        return $user->role === 'admin' || $photo->user_id === $user->id;
    }

    public function delete(User $user, Photo $photo): bool
    {
        return $user->role === 'admin' || $photo->user_id === $user->id;
    }
}
