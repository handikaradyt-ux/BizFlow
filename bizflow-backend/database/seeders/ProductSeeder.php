<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $electronics = Category::where('name', 'Electronics')->first();
        $food = Category::where('name', 'Food')->first();

        Product::create([
            'category_id' => $electronics->id,
            'name' => 'Wireless Mouse',
            'sku' => 'PRD-001',
            'price' => 150000,
            'stock' => 50,
            'image_path' => null,
            'status' => 'active',
        ]);

        Product::create([
            'category_id' => $electronics->id,
            'name' => 'Mechanical Keyboard',
            'sku' => 'PRD-002',
            'price' => 650000,
            'stock' => 20,
            'image_path' => null,
            'status' => 'active',
        ]);

        Product::create([
            'category_id' => $food->id,
            'name' => 'Coffee Beans',
            'sku' => 'PRD-003',
            'price' => 120000,
            'stock' => 35,
            'image_path' => null,
            'status' => 'active',
        ]);
    }
}