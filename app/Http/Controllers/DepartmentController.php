<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::withCount('users')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Departments/Index', [
            'departments' => $departments
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Departments/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:departments',
            'description' => 'nullable|string|max:500',
            'head_of_department' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        try {
            Department::create([
                'name' => $request->name,
                'description' => $request->description,
                'head_of_department' => $request->head_of_department,
                'budget' => $request->budget,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return redirect()->route('departments.index')
                ->with('success', 'Department created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating department: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        $department->load(['users:id,name,email,employee_id,current_salary,position_id']);
        $department->users->load(['position:id,name']);

        return Inertia::render('Departments/Show', [
            'department' => $department
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        return Inertia::render('Departments/Edit', [
            'department' => $department
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'description' => 'nullable|string|max:500',
            'head_of_department' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        try {
            $department->update([
                'name' => $request->name,
                'description' => $request->description,
                'head_of_department' => $request->head_of_department,
                'budget' => $request->budget,
                'is_active' => $request->boolean('is_active'),
            ]);

            return redirect()->route('departments.index')
                ->with('success', 'Department updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error updating department: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        try {
            // Check if department has users
            if ($department->users()->count() > 0) {
                return back()->with('error', 'Cannot delete department that has assigned users. Please reassign users first.');
            }

            $department->delete();

            return redirect()->route('departments.index')
                ->with('success', 'Department deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting department: ' . $e->getMessage());
        }
    }
}
