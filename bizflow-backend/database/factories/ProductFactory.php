<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::inRandomOrder()->first()->id,
            'name' => fake()->words(2, true),
            'sku' => strtoupper(fake()->unique()->bothify('PRD-####')),
            'price' => fake()->randomFloat(2, 10000, 5000000),
            'stock' => fake()->numberBetween(0, 200),
            'image_path' => null,
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}