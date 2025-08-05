<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'unit'])->paginate(10);
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = \App\Models\ProductCategory::active()->ordered()->get(['id', 'name']);
        $units = \App\Models\ProductUnit::active()->ordered()->get(['id', 'name', 'short_name']);

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'units' => $units
        ]);
    }    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:product_categories,id',
            'unit_id' => 'nullable|exists:product_units,id',
            'description' => 'nullable|string',
            'cost_price' => 'nullable|numeric|min:0',
            'tp_price' => 'nullable|numeric|min:0',
            'mrp_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|unique:products',
            'status' => 'required|in:active,inactive',
            'images' => 'nullable|array|max:5', // Max 5 images
            'images.*' => 'image|max:2048', // Each image max 2MB
            'primary_image_index' => 'nullable|integer|min:0', // Index of primary image
        ]);

        try {
            $imagePaths = [];
            $primaryImage = null;

            // Handle multiple image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $imagePath = $image->store('products', 'public');
                    $imagePaths[] = $imagePath;

                    // Set primary image based on index or first image
                    if ($index === (int)$request->input('primary_image_index', 0)) {
                        $primaryImage = $imagePath;
                    }
                }

                // If no primary image set, use first image
                if (!$primaryImage && !empty($imagePaths)) {
                    $primaryImage = $imagePaths[0];
                }
            }

            $validated['images'] = $imagePaths;
            $validated['primary_image'] = $primaryImage;

            Product::create($validated);

            return redirect()->route('products.index')
                ->with('success', 'Product created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating product: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    public function edit(Product $product)
    {
        $categories = \App\Models\ProductCategory::active()->ordered()->get(['id', 'name']);
        $units = \App\Models\ProductUnit::active()->ordered()->get(['id', 'name', 'short_name']);

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units
        ]);
    }    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:product_categories,id',
            'unit_id' => 'nullable|exists:product_units,id',
            'description' => 'nullable|string',
            'cost_price' => 'nullable|numeric|min:0',
            'tp_price' => 'nullable|numeric|min:0',
            'mrp_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'status' => 'required|in:active,inactive',
            'images' => 'nullable|array|max:5', // Max 5 images
            'images.*' => 'image|max:2048', // Each image max 2MB
            'primary_image_index' => 'nullable|integer|min:0', // Index of primary image
            'remove_images' => 'nullable|array', // Array of image paths to remove
            'keep_existing' => 'nullable|boolean', // Whether to keep existing images
        ]);

        try {
            $imagePaths = $product->images ?? [];
            $primaryImage = $product->primary_image;

            // Remove specified images
            if ($request->has('remove_images') && is_array($request->remove_images)) {
                foreach ($request->remove_images as $removeImage) {
                    if (Storage::disk('public')->exists($removeImage)) {
                        Storage::disk('public')->delete($removeImage);
                    }
                    $imagePaths = array_filter($imagePaths, fn($img) => $img !== $removeImage);

                    // Reset primary image if it was removed
                    if ($primaryImage === $removeImage) {
                        $primaryImage = null;
                    }
                }
                $imagePaths = array_values($imagePaths); // Re-index array
            }

            // Handle new image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $imagePath = $image->store('products', 'public');
                    $imagePaths[] = $imagePath;

                    // Set primary image based on total images + new index
                    $totalIndex = count($imagePaths) - 1;
                    if ($request->has('primary_image_index') &&
                        (int)$request->input('primary_image_index') === $totalIndex) {
                        $primaryImage = $imagePath;
                    }
                }
            }

            // Set primary image if not set and images exist
            if (!$primaryImage && !empty($imagePaths)) {
                $primaryImage = $imagePaths[0];
            }

            $validated['images'] = $imagePaths;
            $validated['primary_image'] = $primaryImage;

            $product->update($validated);

            return redirect()->route('products.index')
                ->with('success', 'Product updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error updating product: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(Product $product)
    {
        try {
            // Delete all images if they exist
            if ($product->images && is_array($product->images)) {
                foreach ($product->images as $imagePath) {
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                }
            }

            // Delete primary image if it exists and not in images array
            if ($product->primary_image &&
                Storage::disk('public')->exists($product->primary_image) &&
                (!$product->images || !in_array($product->primary_image, $product->images))) {
                Storage::disk('public')->delete($product->primary_image);
            }

            $product->delete();
            return redirect()->route('products.index')
                ->with('success', 'Product deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting product: ' . $e->getMessage());
        }
    }
}
