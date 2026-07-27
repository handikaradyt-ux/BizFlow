<?php

namespace App\Http\Controllers\Api;

use App\DTOs\ProductDTO;
use App\Http\Controllers\Api\Base\BaseController;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;

class ProductController extends BaseController
{
    public function __construct(
        protected ProductService $service
    ) {}

    public function index()
    {
        return $this->success(
            ProductResource::collection(
                $this->service->getAll()
            ),
            'Products retrieved successfully'
        );
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->service->create(
            ProductDTO::fromArray(
                $request->validated()
            )
        );

        return $this->success(
            new ProductResource($product->load('category')),
            'Product created successfully',
            201
        );
    }

    public function show(Product $product)
    {
        return $this->success(
            new ProductResource(
                $product->load('category')
            ),
            'Product retrieved successfully'
        );
    }

    public function update(
        UpdateProductRequest $request,
        Product $product
    ) {
        $product = $this->service->update(
            $product,
            ProductDTO::fromArray(
                $request->validated()
            )
        );

        return $this->success(
            new ProductResource(
                $product->load('category')
            ),
            'Product updated successfully'
        );
    }

    public function destroy(Product $product)
    {
        $this->service->delete($product);

        return $this->success(
            null,
            'Product deleted successfully'
        );
    }
}