<?php

namespace App\DTOs;

class ProductDTO
{
    public function __construct(
        public readonly int $category_id,
        public readonly string $name,
        public readonly string $sku,
        public readonly float $price,
        public readonly int $stock,
        public readonly ?string $image_path,
        public readonly string $status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            category_id: $data['category_id'],
            name: $data['name'],
            sku: $data['sku'],
            price: $data['price'],
            stock: $data['stock'],
            image_path: $data['image_path'] ?? null,
            status: $data['status'],
        );
    }

    public function toArray(): array
    {
        return [
            'category_id' => $this->category_id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => $this->price,
            'stock' => $this->stock,
            'image_path' => $this->image_path,
            'status' => $this->status,
        ];
    }
}