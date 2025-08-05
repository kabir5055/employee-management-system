<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductCategory::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $categories = $query->withCount('products')
                           ->ordered()
                           ->paginate(10)
                           ->withQueryString();

        return Inertia::render('ProductCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ProductCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:product_categories',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        try {
            $data = $request->only(['name', 'description', 'is_active', 'sort_order']);

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('product-categories', $imageName, 'public');
                $data['image_path'] = $imagePath;
            }

            // Set default values
            $data['is_active'] = $request->boolean('is_active', true);
            $data['sort_order'] = $request->input('sort_order', 0);

            ProductCategory::create($data);

            return redirect()->route('product-categories.index')
                ->with('success', 'Product category created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating category: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        // Load products in this category
        $products = $productCategory->products()
            ->select('id', 'name', 'sku', 'price', 'stock_quantity', 'image', 'is_active')
            ->get();

        return Inertia::render('ProductCategories/Show', [
            'category' => $productCategory,
            'products' => $products
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $productCategory)
    {
        return Inertia::render('ProductCategories/Edit', [
            'category' => $productCategory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductCategory $productCategory)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name,' . $productCategory->id,
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        try {
            $data = $request->only(['name', 'description', 'is_active', 'sort_order']);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($productCategory->image_path) {
                    Storage::disk('public')->delete($productCategory->image_path);
                }

                $image = $request->file('image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('product-categories', $imageName, 'public');
                $data['image_path'] = $imagePath;
            }

            $data['is_active'] = $request->boolean('is_active');
            $data['sort_order'] = $request->input('sort_order', 0);

            $productCategory->update($data);

            return redirect()->route('product-categories.index')
                ->with('success', 'Product category updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error updating category: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory)
    {
        try {
            // Check if category has products
            if ($productCategory->products()->count() > 0) {
                return back()->with('error', 'Cannot delete category that has products. Please move or delete products first.');
            }

            // Delete image if exists
            if ($productCategory->image_path) {
                Storage::disk('public')->delete($productCategory->image_path);
            }

            $productCategory->delete();

            return redirect()->route('product-categories.index')
                ->with('success', 'Product category deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting category: ' . $e->getMessage());
        }
    }

    /**
     * Get all active categories for select options
     */
    public function getActiveCategories()
    {
        $categories = ProductCategory::active()
                                   ->ordered()
                                   ->select('id', 'name')
                                   ->get();

        return response()->json($categories);
    }
}
