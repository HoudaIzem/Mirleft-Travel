<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
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
            'name'        => $this->name,
            'cuisine'     => $this->cuisine,
            'location'    => $this->location,
            'image'       => $this->image,
            'description' => $this->description,
            'price_range' => $this->price_range,
            'phone'       => $this->phone,
            'opening_hours' => $this->opening_hours,
            'reviews'     => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
