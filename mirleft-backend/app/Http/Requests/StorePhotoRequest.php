<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && ! $this->user()->banned_at;
    }

    public function rules(): array
    {
        return [
            'url' => 'nullable|string|max:2048',
            'file' => 'nullable|image|max:5120',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photoable_id' => 'required|integer',
            'photoable_type' => 'required|string|in:App\\Models\\Property,App\\Models\\Restaurant,App\\Models\\Activity,App\\Models\\Destination',
            'is_cover' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
