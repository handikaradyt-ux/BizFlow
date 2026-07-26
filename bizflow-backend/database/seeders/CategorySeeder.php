<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices'
            ],
            [
                'name' => 'Food',
                'description' => 'Food and Beverage'
            ],
            [
                'name' => 'Fashion',
                'description' => 'Fashion Products'
            ],
            [
                'name' => 'Accessories',
                'description' => 'Accessories'
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}