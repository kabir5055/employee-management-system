<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductAdjustment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductAdjustmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductAdjustment::with(['product', 'user', 'approvedBy'])
            ->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhereHas('product', function ($productQuery) use ($search) {
                      $productQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('sku', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by reason
        if ($request->filled('reason')) {
            $query->where('reason', $request->reason);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('adjustment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('adjustment_date', '<=', $request->date_to);
        }

        $adjustments = $query->paginate(15)->withQueryString();

        return Inertia::render('ProductAdjustments/Index', [
            'adjustments' => $adjustments,
            'filters' => $request->only(['search', 'status', 'type', 'reason', 'date_from', 'date_to']),
            'statusOptions' => ['pending', 'approved', 'rejected'],
            'typeOptions' => ['increase', 'decrease'],
            'reasonOptions' => ['damaged', 'expired', 'lost', 'found', 'recount', 'other']
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::with(['category', 'unit'])
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('ProductAdjustments/Create', [
            'products' => $products,
            'typeOptions' => ['increase', 'decrease'],
            'reasonOptions' => ['damaged', 'expired', 'lost', 'found', 'recount', 'other']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:increase,decrease',
            'quantity_adjusted' => 'required|integer|min:1',
            'reason' => 'required|in:damaged,expired,lost,found,recount,other',
            'notes' => 'nullable|string|max:1000',
            'adjustment_date' => 'required|date'
        ]);

        DB::transaction(function () use ($validated) {
            $product = Product::findOrFail($validated['product_id']);

            $oldQuantity = $product->stock_quantity;
            $adjustmentQty = $validated['quantity_adjusted'];

            if ($validated['type'] === 'increase') {
                $newQuantity = $oldQuantity + $adjustmentQty;
            } else {
                $newQuantity = max(0, $oldQuantity - $adjustmentQty);
                $adjustmentQty = $oldQuantity - $newQuantity; // Actual adjusted quantity
            }

            // Create adjustment record
            ProductAdjustment::create([
                'reference_number' => ProductAdjustment::generateReferenceNumber(),
                'product_id' => $validated['product_id'],
                'type' => $validated['type'],
                'quantity_adjusted' => $adjustmentQty,
                'old_quantity' => $oldQuantity,
                'new_quantity' => $newQuantity,
                'reason' => $validated['reason'],
                'notes' => $validated['notes'],
                'user_id' => Auth::id(),
                'adjustment_date' => $validated['adjustment_date'],
                'status' => 'pending'
            ]);

            // Update product stock (optional - you might want approval first)
            // $product->update(['stock_quantity' => $newQuantity]);
        });

        return redirect()->route('product-adjustments.index')
            ->with('success', 'Product adjustment created successfully. Awaiting approval.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductAdjustment $productAdjustment)
    {
        $productAdjustment->load(['product.category', 'product.unit', 'user', 'approvedBy']);

        return Inertia::render('ProductAdjustments/Show', [
            'adjustment' => $productAdjustment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductAdjustment $productAdjustment)
    {
        if ($productAdjustment->status !== 'pending') {
            return redirect()->route('product-adjustments.index')
                ->with('error', 'Only pending adjustments can be edited.');
        }

        $products = Product::with(['category', 'unit'])
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('ProductAdjustments/Edit', [
            'adjustment' => $productAdjustment->load('product'),
            'products' => $products,
            'typeOptions' => ['increase', 'decrease'],
            'reasonOptions' => ['damaged', 'expired', 'lost', 'found', 'recount', 'other']
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductAdjustment $productAdjustment)
    {
        if ($productAdjustment->status !== 'pending') {
            return redirect()->route('product-adjustments.index')
                ->with('error', 'Only pending adjustments can be updated.');
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:increase,decrease',
            'quantity_adjusted' => 'required|integer|min:1',
            'reason' => 'required|in:damaged,expired,lost,found,recount,other',
            'notes' => 'nullable|string|max:1000',
            'adjustment_date' => 'required|date'
        ]);

        DB::transaction(function () use ($validated, $productAdjustment) {
            $product = Product::findOrFail($validated['product_id']);

            $oldQuantity = $product->stock_quantity;
            $adjustmentQty = $validated['quantity_adjusted'];

            if ($validated['type'] === 'increase') {
                $newQuantity = $oldQuantity + $adjustmentQty;
            } else {
                $newQuantity = max(0, $oldQuantity - $adjustmentQty);
                $adjustmentQty = $oldQuantity - $newQuantity;
            }

            $productAdjustment->update([
                'product_id' => $validated['product_id'],
                'type' => $validated['type'],
                'quantity_adjusted' => $adjustmentQty,
                'old_quantity' => $oldQuantity,
                'new_quantity' => $newQuantity,
                'reason' => $validated['reason'],
                'notes' => $validated['notes'],
                'adjustment_date' => $validated['adjustment_date']
            ]);
        });

        return redirect()->route('product-adjustments.index')
            ->with('success', 'Product adjustment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductAdjustment $productAdjustment)
    {
        if ($productAdjustment->status !== 'pending') {
            return redirect()->route('product-adjustments.index')
                ->with('error', 'Only pending adjustments can be deleted.');
        }

        $productAdjustment->delete();

        return redirect()->route('product-adjustments.index')
            ->with('success', 'Product adjustment deleted successfully.');
    }

    /**
     * Approve an adjustment
     */
    public function approve(ProductAdjustment $productAdjustment)
    {
        if ($productAdjustment->status !== 'pending') {
            return back()->with('error', 'Only pending adjustments can be approved.');
        }

        DB::transaction(function () use ($productAdjustment) {
            // Update product stock
            $product = $productAdjustment->product;
            $product->update(['stock_quantity' => $productAdjustment->new_quantity]);

            // Update adjustment status
            $productAdjustment->update([
                'status' => 'approved',
                'approved_by' => Auth::id(),
                'approved_at' => now()
            ]);
        });

        return back()->with('success', 'Product adjustment approved successfully.');
    }

    /**
     * Reject an adjustment
     */
    public function reject(ProductAdjustment $productAdjustment)
    {
        if ($productAdjustment->status !== 'pending') {
            return back()->with('error', 'Only pending adjustments can be rejected.');
        }

        $productAdjustment->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => now()
        ]);

        return back()->with('success', 'Product adjustment rejected.');
    }
}
