<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::withCount('users')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Positions/Index', [
            'positions' => $positions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Positions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:positions',
            'description' => 'nullable|string|max:500',
            'min_salary' => 'nullable|numeric|min:0',
            'max_salary' => 'nullable|numeric|min:0|gte:min_salary',
            'level' => 'required|string|in:entry,junior,mid,senior,lead,manager,director,executive',
            'requirements' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            // Convert requirements text to array
            $requirements = null;
            if ($request->requirements) {
                $requirements = array_filter(
                    array_map('trim', explode("\n", $request->requirements)),
                    function($req) { return !empty($req); }
                );
            }

            Position::create([
                'name' => $request->name,
                'description' => $request->description,
                'min_salary' => $request->min_salary,
                'max_salary' => $request->max_salary,
                'level' => $request->level,
                'requirements' => $requirements,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return redirect()->route('positions.index')
                ->with('success', 'Position created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating position: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Position $position)
    {
        $position->load(['users:id,name,email,employee_id,current_salary']);

        return Inertia::render('Positions/Show', [
            'position' => $position
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Position $position)
    {
        return Inertia::render('Positions/Edit', [
            'position' => $position
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Position $position)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:positions,name,' . $position->id,
            'description' => 'nullable|string|max:500',
            'min_salary' => 'nullable|numeric|min:0',
            'max_salary' => 'nullable|numeric|min:0|gte:min_salary',
            'level' => 'required|string|in:entry,junior,mid,senior,lead,manager,director,executive',
            'requirements' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            // Convert requirements text to array
            $requirements = null;
            if ($request->requirements) {
                $requirements = array_filter(
                    array_map('trim', explode("\n", $request->requirements)),
                    function($req) { return !empty($req); }
                );
            }

            $position->update([
                'name' => $request->name,
                'description' => $request->description,
                'min_salary' => $request->min_salary,
                'max_salary' => $request->max_salary,
                'level' => $request->level,
                'requirements' => $requirements,
                'is_active' => $request->boolean('is_active'),
            ]);

            return redirect()->route('positions.index')
                ->with('success', 'Position updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error updating position: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position)
    {
        try {
            // Check if position has users
            if ($position->users()->count() > 0) {
                return back()->with('error', 'Cannot delete position that has assigned users. Please reassign users first.');
            }

            $position->delete();

            return redirect()->route('positions.index')
                ->with('success', 'Position deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting position: ' . $e->getMessage());
        }
    }
}
