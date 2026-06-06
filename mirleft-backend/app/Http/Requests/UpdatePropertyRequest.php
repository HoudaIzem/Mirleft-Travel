<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'price' => 'nullable|string',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'address_full' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'type' => 'nullable|string|in:hotel,riad,villa,guesthouse',
            'capacity' => 'nullable|integer|min:1',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'status' => 'nullable|in:active,inactive,maintenance',
            'destination_id' => 'nullable|exists:destinations,id',
        ];
    }
}
