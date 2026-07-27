<?php

namespace App\Services;

use App\DTOs\CategoryDTO;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function getAll(): Collection
    {
        return Category::latest()->get();
    }

    public function create(CategoryDTO $dto): Category
    {
        return Category::create($dto->toArray());
    }

    public function update(Category $category, CategoryDTO $dto): Category
    {
        $category->update($dto->toArray());

        return $category->fresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}