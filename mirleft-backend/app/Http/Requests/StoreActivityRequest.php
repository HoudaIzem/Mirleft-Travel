<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string',
            'address_full' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'difficulty_level' => 'nullable|string|in:easy,moderate,hard',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'status' => 'nullable|in:active,inactive,seasonal',
            'destination_id' => 'nullable|exists:destinations,id',
        ];
    }
}
