<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'question' => 'nullable|string|max:500',
            'answer' => 'nullable|string|max:5000',
            'category' => 'nullable|string|max:100',
        ];
    }
}
