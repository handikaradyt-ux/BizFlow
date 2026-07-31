<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'invoice_number' => 'INV-' . str_pad($this->id, 8, '0', STR_PAD_LEFT),
            'transaction_date' => $this->created_at->toDateTimeString(),

            'cashier' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),

            'customer' => $this->whenLoaded('customer', fn () => $this->customer ? [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'phone' => $this->customer->phone,
                'email' => $this->customer->email,
                'address' => $this->customer->address,
            ] : null),

            'items' => $this->whenLoaded('details', function () {
                return $this->details->map(fn ($detail) => [
                    'product_name' => $detail->product->name ?? 'Unknown Product',
                    'sku' => $detail->product->sku ?? null,
                    'quantity' => $detail->quantity,
                    'unit_price' => (float) $detail->unit_price,
                    'line_total' => (float) $detail->line_total,
                ]);
            }),

            'subtotal' => (float) $this->subtotal,
            'tax' => (float) $this->tax,
            'grand_total' => (float) $this->grand_total,
            'status' => $this->status,
        ];
    }
}
