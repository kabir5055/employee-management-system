<?php

namespace App\Http\Controllers;

use App\Models\BalanceSheet;
use App\Models\ProductDelivery;
use App\Models\User;
use App\Models\Expense;
use App\Exports\BalanceSheetExport;
use App\Imports\BalanceSheetImport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Traits\HasRoles;


class BalanceSheetController extends Controller
{
    use AuthorizesRequests;

    private function userHasRole($roles)
    {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();
        return !empty(array_intersect($userRoles, (array)$roles));
    }

    private function getEmployeesList()
    {
        $user = Auth::user();
        // Check if user has admin or manager roles
        $userRoles = $user->roles->pluck('name')->toArray();
        if (in_array('Super Admin', $userRoles) || in_array('Administrator', $userRoles) || in_array('Manager', $userRoles)) {
            return User::whereHas('roles', function($query) {
                $query->where('name', 'Employee');
            })->get(['id', 'name']);
        }
        return collect([$user])->map->only(['id', 'name']);
    }
    public function index(Request $request)
    {
        $query = BalanceSheet::with(['employee', 'updatedByUser'])
            ->when($request->input('employee_id'), function ($query, $employeeId) {
                $query->where('employee_id', $employeeId);
            })
            ->when($request->input('date_from'), function ($query, $dateFrom) {
                $query->where('date', '>=', Carbon::parse($dateFrom)->startOfDay());
            })
            ->when($request->input('date_to'), function ($query, $dateTo) {
                $query->where('date', '<=', Carbon::parse($dateTo)->endOfDay());
            })
            ->when(!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']), function ($query) {
                $query->where('employee_id', Auth::id());
            });

        $balanceSheets = $query->orderBy('date', 'desc')->paginate(10)
            ->through(function ($sheet) {
                $sheet->total_amount = $sheet->getTotalAmount();
                return $sheet;
            });

        return Inertia::render('BalanceSheets/Index', [
            'balanceSheets' => $balanceSheets,
            'employees' => fn () => $this->getEmployeesList(),
            'canViewAllEmployees' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager']),
            'filters' => $request->only(['employee_id', 'date_from', 'date_to'])
        ]);
    }

    public function show($employeeId)
    {
        $balanceSheet = BalanceSheet::where('employee_id', $employeeId)
            ->with(['employee', 'productDeliveries', 'expenses'])
            ->firstOrFail();

        $deliveries = ProductDelivery::where('employee_id', $employeeId)
            ->with('product')
            ->orderBy('delivery_date', 'desc')
            ->paginate(10);

        return Inertia::render('BalanceSheets/Show', [
            'balanceSheet' => $balanceSheet,
            'deliveries' => $deliveries,
            'canEdit' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager'])
        ]);
    }

    public function updateBalance(Request $request, $id)
    {
        // Check if user has permission to update balance sheets
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to update balance sheets');
        }

        $request->validate([
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
            'product_delivery_amount' => 'required|numeric|min:0',
            'expense_amount' => 'required|numeric|min:0',
            'market_cost' => 'required|numeric|min:0',
            'ta_da' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        $balanceSheet = BalanceSheet::findOrFail($id);

        DB::transaction(function () use ($request, $balanceSheet) {
            $newTotal = $request->input('product_delivery_amount') +
                       $request->input('expense_amount') +
                       $request->input('market_cost') +
                       $request->input('ta_da');

            $oldTotal = $balanceSheet->getTotalAmount();
            $difference = $newTotal - $oldTotal;

            $balanceSheet->date = $request->input('date');
            $balanceSheet->location = $request->input('location');
            $balanceSheet->product_delivery_amount = $request->input('product_delivery_amount');
            $balanceSheet->expense_amount = $request->input('expense_amount');
            $balanceSheet->market_cost = $request->input('market_cost');
            $balanceSheet->ta_da = $request->input('ta_da');
            $balanceSheet->notes = $request->input('notes');
            $balanceSheet->current_balance += $difference;
            $balanceSheet->updated_by = Auth::id();
            $balanceSheet->save();
        });

        return back()->with('success', 'Balance sheet updated successfully');
    }

    public function export(Request $request)
    {
        // Check if user has permission to export balance sheets
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to export balance sheets');
        }

        $filters = $request->only(['employee_id', 'date_from', 'date_to']);
        $type = $request->input('type', 'xlsx');

        return Excel::download(
            new BalanceSheetExport($filters),
            'balance_sheet_' . Carbon::now()->format('Y-m-d') . '.' . $type
        );
    }

    public function import(Request $request)
    {
        // Check if user has permission to import balance sheets
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to import balance sheets');
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv'
        ]);

        try {
            Excel::import(new BalanceSheetImport(), $request->file('file'));
            return response()->json(['success' => 'Balance sheets imported successfully']);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            return response()->json([
                'importErrors' => collect($e->failures())->map(function ($failure) {
                    return [
                        'row' => $failure->row(),
                        'errors' => $failure->errors()
                    ];
                })
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error importing balance sheets: ' . $e->getMessage()], 422);
        }
    }
}
