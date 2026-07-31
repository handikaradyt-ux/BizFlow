<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::with('category');

        // 1. Search
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->input('search');
            $q->where(function ($subQ) use ($search) {
                $subQ->where('name', 'like', "%{$search}%")
                     ->orWhere('sku', 'like', "%{$search}%");
            });
        });

        // 2. Category Filter
        $query->when($request->filled('category_id'), function ($q) use ($request) {
            $q->where('category_id', $request->input('category_id'));
        });

        // 3. Status Filter
        $query->when($request->filled('status'), function ($q) use ($request) {
            $q->where('status', $request->input('status'));
        });

        // 4. Stock Range
        $query->when($request->filled('stock_min'), function ($q) use ($request) {
            $q->where('stock', '>=', $request->input('stock_min'));
        });
        
        $query->when($request->filled('stock_max'), function ($q) use ($request) {
            $q->where('stock', '<=', $request->input('stock_max'));
        });

        // 5. Sorting
        $allowedSortFields = ['name', 'selling_price', 'stock', 'created_at'];
        $allowedDirections = ['asc', 'desc'];
        
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }
        
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'desc';
        }
        
        $query->orderBy($sortBy, $sortDirection);

        // 6. Pagination
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage > 100) {
            $perPage = 100;
        } elseif ($perPage < 1) {
            $perPage = 10;
        }
        
        $products = $query->paginate($perPage);
        
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->uploadImage($request->file('image'));
        }
        
        $product = Product::create($validated);
        $product->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product)
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
            'data' => new ProductResource($product)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();
        
        if ($request->hasFile('image')) {
            $this->deleteImage($product->image_path);
            $validated['image_path'] = $this->uploadImage($request->file('image'));
        }
        
        $product->update($validated);
        $product->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $this->deleteImage($product->image_path);
        
        // Clear the image path in the database to reflect the actual storage state
        $product->update(['image_path' => null]);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.'
        ], 200);
    }

    /**
     * Handle image upload.
     */
    private function uploadImage(UploadedFile $file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('products', $filename, 'public');
    }

    /**
     * Handle image deletion.
     */
    private function deleteImage(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}