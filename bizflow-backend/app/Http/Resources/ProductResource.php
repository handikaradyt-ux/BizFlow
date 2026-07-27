<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],

            'name' => $this->name,

            'sku' => $this->sku,

            'price' => $this->price,

            'stock' => $this->stock,

            'image_path' => $this->image_path,

            'status' => $this->status,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}