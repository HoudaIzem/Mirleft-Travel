<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'category'    => $this->category,
            'duration'    => $this->duration,
            'image'       => $this->image,
            'description' => $this->description,
            'price'       => $this->price,
            'location'    => $this->location,
            'reviews'     => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
