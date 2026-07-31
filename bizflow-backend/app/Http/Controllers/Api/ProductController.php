<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $products = Product::with('category')->get();
        
        // We will return JSON directly for now, ProductResource will be implemented later
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        // Validation is completely handled by StoreProductRequest
        $validated = $request->validated();
        
        // Image upload logic is excluded per instructions
        
        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $product->load('category');
        
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        // Validation is completely handled by UpdateProductRequest
        $validated = $request->validated();
        
        // Image upload logic is excluded per instructions
        
        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        // Product uses SoftDeletes
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.'
        ], 200); // Or 204 No Content
    }
}