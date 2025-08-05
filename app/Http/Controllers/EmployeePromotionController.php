<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Position;
use App\Models\Department;
use App\Models\EmployeePromotionHistory;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class EmployeePromotionController extends Controller
{
    /**
     * Display a listing of promotion histories.
     */
    public function index(Request $request)
    {
        $query = EmployeePromotionHistory::with([
            'user',
            'previousPosition',
            'newPosition',
            'previousDepartment',
            'newDepartment',
            'approvedBy'
        ]);

        // Filters
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('promotion_type')) {
            $query->where('promotion_type', $request->promotion_type);
        }

        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('employee_id', 'like', '%' . $request->search . '%');
            });
        }

        $promotions = $query->orderBy('effective_date', 'desc')
                          ->paginate(15)
                          ->withQueryString();

        $employees = User::select('id', 'name', 'employee_id')->get();

        return Inertia::render('EmployeePromotions/Index', [
            'promotions' => $promotions,
            'employees' => $employees,
            'filters' => $request->only(['user_id', 'promotion_type', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new promotion.
     */
    public function create(Request $request)
    {
        $employees = User::with(['position', 'department'])
                        ->select('id', 'name', 'employee_id', 'position_id', 'department_id', 'current_salary')
                        ->get();

        $positions = Position::active()->get();
        $departments = Department::active()->get();

        $selectedEmployee = null;
        if ($request->filled('user_id')) {
            $selectedEmployee = User::with(['position', 'department'])
                                  ->find($request->user_id);
        }

        return Inertia::render('EmployeePromotions/Create', [
            'employees' => $employees,
            'positions' => $positions,
            'departments' => $departments,
            'selectedEmployee' => $selectedEmployee
        ]);
    }

    /**
     * Store a newly created promotion.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'new_position_id' => 'nullable|exists:positions,id',
            'new_department_id' => 'nullable|exists:departments,id',
            'new_salary' => 'nullable|numeric|min:0',
            'promotion_type' => 'required|in:promotion,demotion,transfer,salary_change',
            'effective_date' => 'required|date',
            'reason' => 'required|string|max:1000',
            'notes' => 'nullable|string|max:2000'
        ]);

        try {
            DB::beginTransaction();

            $employee = User::findOrFail($request->user_id);

            // Create promotion history record
            $promotion = EmployeePromotionHistory::create([
                'user_id' => $request->user_id,
                'previous_position_id' => $employee->position_id,
                'previous_department_id' => $employee->department_id,
                'previous_salary' => $employee->current_salary,
                'new_position_id' => $request->new_position_id,
                'new_department_id' => $request->new_department_id,
                'new_salary' => $request->new_salary,
                'promotion_type' => $request->promotion_type,
                'effective_date' => $request->effective_date,
                'reason' => $request->reason,
                'approved_by' => Auth::id(),
                'approved_at' => now()
            ]);

            // Update employee's current position, department, and salary
            $employee->update([
                'position_id' => $request->new_position_id ?: $employee->position_id,
                'department_id' => $request->new_department_id ?: $employee->department_id,
                'current_salary' => $request->new_salary ?: $employee->current_salary
            ]);

            DB::commit();

            return redirect()->route('employee-promotions.index')
                           ->with('success', 'Employee promotion recorded successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to record promotion: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified promotion.
     */
    public function show(EmployeePromotionHistory $employeePromotion)
    {
        $employeePromotion->load([
            'user.department',
            'user.position',
            'previousPosition',
            'newPosition',
            'previousDepartment',
            'newDepartment',
            'approvedBy'
        ]);

        // Get all promotion history for this employee
        $allPromotions = EmployeePromotionHistory::where('user_id', $employeePromotion->user_id)
            ->with([
                'user.department',
                'user.position',
                'previousPosition',
                'newPosition',
                'previousDepartment',
                'newDepartment',
                'approvedBy'
            ])
            ->orderBy('effective_date', 'desc')
            ->get();

        return Inertia::render('EmployeePromotions/Show', [
            'promotion' => $employeePromotion,
            'allPromotions' => $allPromotions,
            'employee' => $employeePromotion->user
        ]);
    }

    /**
     * Show the form for editing the specified promotion.
     */
    public function edit(EmployeePromotionHistory $employeePromotion)
    {
        $employeePromotion->load(['user', 'previousPosition', 'newPosition', 'previousDepartment', 'newDepartment']);

        $employees = User::with(['position', 'department'])->get();
        $positions = Position::all();
        $departments = Department::all();

        return Inertia::render('EmployeePromotions/Edit', [
            'promotion' => $employeePromotion,
            'employees' => $employees,
            'positions' => $positions,
            'departments' => $departments
        ]);
    }

    /**
     * Update the specified promotion.
     */
    public function update(Request $request, EmployeePromotionHistory $employeePromotion)
    {
        $request->validate([
            'new_position_id' => 'nullable|exists:positions,id',
            'new_department_id' => 'nullable|exists:departments,id',
            'new_salary' => 'nullable|numeric|min:0',
            'promotion_type' => 'required|in:promotion,demotion,transfer,salary_change',
            'effective_date' => 'required|date',
            'reason' => 'required|string|max:1000',
            'notes' => 'nullable|string|max:2000'
        ]);

        try {
            DB::beginTransaction();

            $employeePromotion->update([
                'new_position_id' => $request->new_position_id,
                'new_department_id' => $request->new_department_id,
                'new_salary' => $request->new_salary,
                'promotion_type' => $request->promotion_type,
                'effective_date' => $request->effective_date,
                'reason' => $request->reason,
                'notes' => $request->notes
            ]);

            // Update the employee's current details if this is the most recent promotion
            $latestPromotion = EmployeePromotionHistory::where('user_id', $employeePromotion->user_id)
                                                      ->orderBy('effective_date', 'desc')
                                                      ->first();

            if ($latestPromotion->id === $employeePromotion->id) {
                $employee = User::findOrFail($employeePromotion->user_id);
                $employee->update([
                    'position_id' => $request->new_position_id ?: $employee->position_id,
                    'department_id' => $request->new_department_id ?: $employee->department_id,
                    'current_salary' => $request->new_salary ?: $employee->current_salary
                ]);
            }

            DB::commit();

            return redirect()->route('employee-promotions.index')
                           ->with('success', 'Promotion record updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update promotion: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified promotion.
     */
    public function destroy(EmployeePromotionHistory $employeePromotion)
    {
        try {
            DB::beginTransaction();

            // Check if this is the latest promotion for this employee
            $latestPromotion = EmployeePromotionHistory::where('user_id', $employeePromotion->user_id)
                                                      ->orderBy('effective_date', 'desc')
                                                      ->first();

            if ($latestPromotion->id === $employeePromotion->id) {
                // Revert employee to previous state or second latest promotion
                $previousPromotion = EmployeePromotionHistory::where('user_id', $employeePromotion->user_id)
                                                            ->where('id', '!=', $employeePromotion->id)
                                                            ->orderBy('effective_date', 'desc')
                                                            ->first();

                $employee = User::findOrFail($employeePromotion->user_id);

                if ($previousPromotion) {
                    $employee->update([
                        'position_id' => $previousPromotion->new_position_id,
                        'department_id' => $previousPromotion->new_department_id,
                        'current_salary' => $previousPromotion->new_salary
                    ]);
                } else {
                    // Revert to original state stored in this record
                    $employee->update([
                        'position_id' => $employeePromotion->previous_position_id,
                        'department_id' => $employeePromotion->previous_department_id,
                        'current_salary' => $employeePromotion->previous_salary
                    ]);
                }
            }

            $employeePromotion->delete();

            DB::commit();

            return redirect()->route('employee-promotions.index')
                           ->with('success', 'Promotion record deleted successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete promotion: ' . $e->getMessage()]);
        }
    }

    /**
     * Get promotion history for a specific employee.
     */
    public function employeeHistory(Request $request, User $employee)
    {
        $promotions = EmployeePromotionHistory::with([
            'previousPosition',
            'newPosition',
            'previousDepartment',
            'newDepartment',
            'approvedBy'
        ])
        ->where('user_id', $employee->id)
        ->orderBy('effective_date', 'desc')
        ->paginate(10);

        return Inertia::render('EmployeePromotions/EmployeeHistory', [
            'employee' => $employee->load(['position', 'department']),
            'promotions' => $promotions
        ]);
    }
}
