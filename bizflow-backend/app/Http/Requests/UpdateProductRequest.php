<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Access the product being updated via the route
        $product = $this->route('product');

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'sku' => [
                'required', 
                'string', 
                'max:50', 
                Rule::unique('products', 'sku')->ignore($product)
            ],
            'description' => ['nullable', 'string'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'category_id.exists' => 'The selected category is invalid.',
            'sku.unique' => 'This SKU is already in use by another product.',
            'image.max' => 'The image must not be larger than 2MB.',
        ];
    }
}