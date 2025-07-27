<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Thana;
use App\Filters\EmployeeFilter;
use App\Services\ExportService;
use App\Exports\EmployeeExport;
use App\Imports\EmployeeImport;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    protected $exportService;

    public function __construct(ExportService $exportService)
    {
        $this->exportService = $exportService;
    }

    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:excel,csv,pdf'
        ]);

        $query = User::with([
            'department',
            'position',
            'district',
            'upazila',
            'thana'
        ])->filter(new EmployeeFilter($request));

        $employees = $query->get();

        return $this->exportService->export(
            $employees,
            $request->input('type'),
            EmployeeExport::class,
            'employees_' . now()->format('Y_m_d')
        );
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv'
        ]);

        try {
            $import = new EmployeeImport();
            Excel::import($import, $request->file('file'));

            $message = sprintf(
                'Successfully imported %d employees. ',
                $import->getSuccessCount()
            );

            if (count($import->getErrors()) > 0) {
                $message .= sprintf(
                    'Failed to import %d rows. Check the errors below.',
                    count($import->getErrors())
                );
                return back()->with([
                    'success' => $message,
                    'importErrors' => $import->getErrors()
                ]);
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'Error importing file: ' . $e->getMessage());
        }
    }

    public function index(Request $request)
    {
        $query = User::with([
            'department',
            'position',
            'district',
            'upazila',
            'thana'
        ])->filter(new EmployeeFilter($request));

        $employees = $query->orderBy('employee_id', 'asc')
            ->paginate(10)
            ->withQueryString();
        $departments = Department::all();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department', 'status']),
        ]);
    }

    public function create()
    {
        $departments = Department::all();
        $positions = Position::with('department')->get();

        return Inertia::render('Employees/Create', [
            'departments' => $departments,
            'positions' => $positions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'employee_id' => 'required|string|unique:users,employee_id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'joining_date' => 'required|date',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'current_salary' => 'required|numeric|min:0',
            'role' => 'required|in:admin,hr,employee',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('password123'),
            'employee_id' => $request->employee_id,
            'phone' => $request->phone,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'joining_date' => $request->joining_date,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
            'current_salary' => $request->current_salary,
            'role' => $request->role,
            'status' => 'active',
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    public function show($id)
    {
        $employee = User::with([
            'department',
            'position',
            'salaryStructures',
            'attendance' => function($query) {
                $query->orderBy('date', 'desc')->take(30);
            },
            'productDeliveries.product',
            'collections',
            'expenses'
        ])->findOrFail($id);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    public function edit($id)
    {
        $employee = User::findOrFail($id);
        $departments = Department::all();
        $positions = Position::with('department')->get();

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'departments' => $departments,
            'positions' => $positions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $employee = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'employee_id' => 'required|string|unique:users,employee_id,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'joining_date' => 'required|date',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'current_salary' => 'required|numeric|min:0',
            'role' => 'required|in:admin,hr,employee',
            'status' => 'required|in:active,inactive',
        ]);

        $employee->update($request->all());

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy($id)
    {
        $employee = User::findOrFail($id);
        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
