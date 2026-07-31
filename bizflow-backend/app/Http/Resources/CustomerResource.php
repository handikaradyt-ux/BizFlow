<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            
            'summary' => $this->when($this->transactions_count !== null || $this->transactions_sum_grand_total !== null, function () {
                return [
                    'order_count' => (int) ($this->transactions_count ?? 0),
                    'lifetime_spend' => (float) ($this->transactions_sum_grand_total ?? 0),
                ];
            }),
            
            'transactions' => $this->whenLoaded('transactions'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}