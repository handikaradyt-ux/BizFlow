<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CategoryDTO;
use App\Http\Controllers\Api\Base\BaseController;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryController extends BaseController
{
    public function __construct(
        protected CategoryService $service
    ) {}

    public function index()
    {
        return $this->success(
            CategoryResource::collection(
                $this->service->getAll()
            ),
            'Categories retrieved successfully'
        );
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->service->create(
            CategoryDTO::fromArray(
                $request->validated()
            )
        );

        return $this->success(
            new CategoryResource($category),
            'Category created successfully',
            201
        );
    }

    public function show(Category $category)
    {
        return $this->success(
            new CategoryResource($category),
            'Category retrieved successfully'
        );
    }

    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ) {
        $category = $this->service->update(
            $category,
            CategoryDTO::fromArray(
                $request->validated()
            )
        );

        return $this->success(
            new CategoryResource($category),
            'Category updated successfully'
        );
    }

    public function destroy(Category $category)
    {
        $this->service->delete($category);

        return $this->success(
            null,
            'Category deleted successfully'
        );
    }
}