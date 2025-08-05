<?php

namespace App\Http\Controllers;

use App\Models\ProductUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductUnit::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('short_name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $units = $query->withCount('products')
                      ->ordered()
                      ->paginate(10)
                      ->withQueryString();

        return Inertia::render('ProductUnits/Index', [
            'units' => $units,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ProductUnits/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_units',
            'short_name' => 'required|string|max:10|unique:product_units',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        try {
            // Set default values
            $validated['is_active'] = $request->boolean('is_active', true);
            $validated['sort_order'] = $request->input('sort_order', 0);

            ProductUnit::create($validated);

            return redirect()->route('product-units.index')
                ->with('success', 'Product unit created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating unit: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductUnit $productUnit)
    {
        // Load products in this unit
        $products = $productUnit->products()
            ->select('id', 'name', 'sku', 'price', 'stock_quantity', 'image_path', 'status')
            ->get();

        return Inertia::render('ProductUnits/Show', [
            'unit' => $productUnit,
            'products' => $products
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductUnit $productUnit)
    {
        return Inertia::render('ProductUnits/Edit', [
            'unit' => $productUnit
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductUnit $productUnit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_units,name,' . $productUnit->id,
            'short_name' => 'required|string|max:10|unique:product_units,short_name,' . $productUnit->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        try {
            // Set default values
            $validated['is_active'] = $request->boolean('is_active', true);
            $validated['sort_order'] = $request->input('sort_order', 0);

            $productUnit->update($validated);

            return redirect()->route('product-units.index')
                ->with('success', 'Product unit updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error updating unit: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductUnit $productUnit)
    {
        try {
            // Check if unit has products
            if ($productUnit->products()->count() > 0) {
                return back()->withErrors(['error' => 'Cannot delete unit that has products assigned to it.']);
            }

            $productUnit->delete();

            return redirect()->route('product-units.index')
                ->with('success', 'Product unit deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error deleting unit: ' . $e->getMessage()]);
        }
    }
}
