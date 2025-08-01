<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductDelivery;
use App\Models\BalanceSheet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductDeliveryController extends Controller
{
    public function index()
    {
        $deliveries = ProductDelivery::with(['employee', 'product'])
            ->orderBy('delivery_date', 'desc')
            ->paginate(10);

        return Inertia::render('ProductDeliveries/Index', [
            'deliveries' => $deliveries
        ]);
    }

    public function create()
    {
        $products = Product::all();
        $employees = \App\Models\User::with('position')->where('status', 'active')->get();

        return Inertia::render('ProductDeliveries/Create', [
            'products' => $products,
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'delivery_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock_quantity < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Insufficient stock available.']);
        }

        $validated['total_amount'] = $validated['quantity'] * $validated['unit_price'];
        $validated['status'] = 'pending';

        $delivery = ProductDelivery::create($validated);

        // Update product stock
        $product->decrement('stock_quantity', $validated['quantity']);

        // Update employee's balance sheet
        $balanceSheet = BalanceSheet::firstOrCreate(
            ['employee_id' => $validated['employee_id']],
            ['opening_balance' => 0, 'current_balance' => 0]
        );

        $balanceSheet->current_balance -= $validated['total_amount'];
        $balanceSheet->save();

        return redirect()->route('product-deliveries.index')
            ->with('success', 'Product delivery created successfully');
    }

    public function show(ProductDelivery $productDelivery)
    {
        $productDelivery->load(['employee', 'product']);

        return Inertia::render('ProductDeliveries/Show', [
            'delivery' => $productDelivery
        ]);
    }

    public function edit(ProductDelivery $productDelivery)
    {
        $productDelivery->load(['employee', 'product']);
        $products = Product::all();
        $employees = \App\Models\User::with('position')->where('status', 'active')->get();

        return Inertia::render('ProductDeliveries/Edit', [
            'delivery' => $productDelivery,
            'products' => $products,
            'employees' => $employees
        ]);
    }

    public function update(Request $request, ProductDelivery $productDelivery)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'delivery_date' => 'required|date',
            'status' => 'required|in:pending,completed,cancelled',
            'notes' => 'nullable|string'
        ]);

        // Check if quantity is being updated
        $quantityDifference = $validated['quantity'] - $productDelivery->quantity;

        if ($quantityDifference > 0) {
            // Check if we have enough stock for the increase
            $product = $productDelivery->product;
            if ($product->stock_quantity < $quantityDifference) {
                return back()->withErrors(['quantity' => 'Insufficient stock for quantity increase.']);
            }
            // Decrease stock by the difference
            $product->decrement('stock_quantity', $quantityDifference);
        } elseif ($quantityDifference < 0) {
            // Return stock for the decrease
            $product = $productDelivery->product;
            $product->increment('stock_quantity', abs($quantityDifference));
        }

        $oldAmount = $productDelivery->total_amount;
        $validated['total_amount'] = $validated['quantity'] * $validated['unit_price'];

        $productDelivery->update($validated);

        // Update balance sheet
        if ($oldAmount !== $validated['total_amount']) {
            $balanceSheet = BalanceSheet::where('employee_id', $productDelivery->employee_id)->first();
            if ($balanceSheet) {
                $balanceSheet->current_balance += $oldAmount;
                $balanceSheet->current_balance -= $validated['total_amount'];
                $balanceSheet->save();
            }
        }

        return redirect()->route('product-deliveries.index')
            ->with('success', 'Product delivery updated successfully');
    }

    public function destroy(ProductDelivery $productDelivery)
    {
        // Update balance sheet before deleting
        $balanceSheet = BalanceSheet::where('employee_id', $productDelivery->employee_id)->first();
        $balanceSheet->current_balance += $productDelivery->total_amount;
        $balanceSheet->save();

        $productDelivery->delete();

        return redirect()->route('product-deliveries.index')
            ->with('success', 'Product delivery deleted successfully');
    }
}
