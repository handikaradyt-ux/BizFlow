<?php

namespace App\Services;

use App\DTOs\ProductDTO;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    public function getAll(): Collection
    {
        return Product::with('category')
            ->latest()
            ->get();
    }

    public function create(ProductDTO $dto): Product
    {
        return Product::create(
            $dto->toArray()
        );
    }

    public function update(Product $product, ProductDTO $dto): Product
    {
        $product->update(
            $dto->toArray()
        );

        return $product->fresh();
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }
}