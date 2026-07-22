<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Product::query()->orderBy('category')->orderBy('name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']).'-'.Str::lower(Str::random(5));

        return response()->json(['data' => Product::create($data)], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $product->update($this->validated($request, $product));

        return response()->json(['data' => $product->fresh()]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'sku' => [$product ? 'sometimes' : 'required', 'string', 'max:60', Rule::unique('products')->ignore($product)],
            'name' => [$product ? 'sometimes' : 'required', 'string', 'max:160'],
            'category' => [$product ? 'sometimes' : 'required', 'string', 'max:100'],
            'description' => [$product ? 'sometimes' : 'required', 'string', 'max:2000'],
            'price' => [$product ? 'sometimes' : 'required', 'numeric', 'min:0', 'max:9999999999'],
            'stock_quantity' => [$product ? 'sometimes' : 'required', 'integer', 'min:0', 'max:1000000'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
    }
}
