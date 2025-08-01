<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Thana;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonalInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with(['department', 'position'])
            ->select([
                'id', 'name', 'email', 'employee_id', 'phone', 'address',
                'date_of_birth', 'joining_date', 'department_id', 'position_id',
                'nid_number', 'district_id', 'upazila_id', 'thana_id'
            ]);

        // Search functionality
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('employee_id', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by department
        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        $employees = $query->orderBy('name')->paginate(10);
        $departments = Department::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('PersonalInfo/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department_id'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::where('is_active', true)->orderBy('name')->get();
        $positions = Position::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('PersonalInfo/Create', [
            'departments' => $departments,
            'positions' => $positions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'employee_id' => 'nullable|string|max:50|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date',
            'joining_date' => 'nullable|date',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'nid_number' => 'nullable|string|max:20',
            'district_id' => 'nullable|exists:districts,id',
            'upazila_id' => 'nullable|exists:upazilas,id',
            'thana_id' => 'nullable|exists:thanas,id',
        ]);

        try {
            User::create($request->only([
                'name', 'email', 'employee_id', 'phone', 'address',
                'date_of_birth', 'joining_date', 'department_id', 'position_id',
                'nid_number', 'district_id', 'upazila_id', 'thana_id'
            ]));

            return redirect()->route('personal-info.index')
                ->with('success', 'Employee personal information created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating employee: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $personalInfo)
    {
        $personalInfo->load(['department', 'position', 'district', 'upazila', 'thana']);

        return Inertia::render('PersonalInfo/Show', [
            'employee' => $personalInfo
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $personalInfo)
    {
        $personalInfo->load(['department', 'position', 'district', 'upazila', 'thana']);
        $departments = Department::where('is_active', true)->orderBy('name')->get();
        $positions = Position::where('is_active', true)->orderBy('name')->get();
        $districts = District::orderBy('name')->get();

        // Get upazilas and thanas if the employee has them selected
        $upazilas = $personalInfo->district_id ?
            Upazila::where('district_id', $personalInfo->district_id)->orderBy('name')->get() :
            collect();

        $thanas = $personalInfo->upazila_id ?
            Thana::where('upazila_id', $personalInfo->upazila_id)->orderBy('name')->get() :
            collect();

        return Inertia::render('PersonalInfo/Edit', [
            'employee' => $personalInfo,
            'departments' => $departments,
            'positions' => $positions,
            'districts' => $districts,
            'upazilas' => $upazilas,
            'thanas' => $thanas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $personalInfo)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $personalInfo->id,
            'employee_id' => 'nullable|string|max:50|unique:users,employee_id,' . $personalInfo->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date',
            'joining_date' => 'nullable|date',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'nid_number' => 'nullable|string|max:20',
            'district_id' => 'nullable|exists:districts,id',
            'upazila_id' => 'nullable|exists:upazilas,id',
            'thana_id' => 'nullable|exists:thanas,id',
        ]);

        try {
            $personalInfo->update($request->only([
                'name', 'email', 'employee_id', 'phone', 'address',
                'date_of_birth', 'joining_date', 'department_id', 'position_id',
                'nid_number', 'district_id', 'upazila_id', 'thana_id'
            ]));

            return redirect()->route('personal-info.index')
                ->with('success', 'Employee personal information updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error updating employee: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $personalInfo)
    {
        try {
            $personalInfo->delete();

            return redirect()->route('personal-info.index')
                ->with('success', 'Employee personal information deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting employee: ' . $e->getMessage());
        }
    }
}
