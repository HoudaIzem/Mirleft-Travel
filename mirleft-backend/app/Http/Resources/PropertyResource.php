<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'rating' => $this->rating,
            'average_rating' => $this->average_rating,
            'reviews_count' => $this->reviews_count,
            'image' => $this->image,
            'description' => $this->description,
            'location' => $this->location,
            'address_full' => $this->address_full,
            'type' => $this->type,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'capacity' => $this->capacity,
            'phone' => $this->phone,
            'email' => $this->email,
            'booking_link' => $this->booking_link,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'destination_id' => $this->destination_id,
            'amenities_description' => $this->amenities_description,
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'photos' => $this->whenLoaded('photos'),
            'amenities' => $this->whenLoaded('amenities'),
            'destination' => $this->whenLoaded('destination'),
        ];
    }
}
