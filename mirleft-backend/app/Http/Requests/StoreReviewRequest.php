<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && ! $this->user()->banned_at;
    }

    public function rules(): array
    {
        return [
            'reviewable_type' => 'required|string|in:App\\Models\\Property,App\\Models\\Restaurant,App\\Models\\Activity,App\\Models\\Destination',
            'reviewable_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'text' => 'required|string|max:2000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'nullable|string|max:1000',
        ];
    }
}
