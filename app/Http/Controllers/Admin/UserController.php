<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct()
    {
        // Only super admins can manage users
        $this->middleware(function ($request, $next) {
            if (!Auth::check() || !Auth::user()->is_super_admin) {
                abort(403, 'Unauthorized. Super admin access required.');
            }
            return $next($request);
        });
    }

    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::with(['department', 'position']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('status')) {
            $isActive = $request->input('status') === 'active';
            $query->where('is_active', $isActive);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        $departments = Department::all();
        $positions = Position::all();

        return Inertia::render('Admin/Users/Create', [
            'departments' => $departments,
            'positions' => $positions
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'employee_id' => 'nullable|string|max:50|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'is_active' => 'boolean',
            'is_super_admin' => 'boolean',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        try {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'employee_id' => $request->employee_id,
                'phone' => $request->phone,
                'address' => $request->address,
                'hire_date' => $request->hire_date,
                'salary' => $request->salary,
                'department_id' => $request->department_id,
                'position_id' => $request->position_id,
                'is_active' => $request->boolean('is_active', true),
                'is_super_admin' => $request->boolean('is_super_admin', false),
            ];

            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('users', 'public');
                $userData['image_path'] = $imagePath;
            }

            $user = User::create($userData);

            return redirect()->route('admin.users.index')
                ->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating user: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        $user->load(['department', 'position']);

        // Get user activity/stats
        $stats = [
            'total_deliveries' => $user->deliveries()->count(),
            'total_sales' => $user->deliveries()->sum('total_amount'),
            'total_commission' => $user->deliveries()->sum('commission_amount'),
            'current_balance' => $user->balanceSheets()->latest()->first()?->current_balance ?? 0,
            'total_expenses' => $user->expenses()->sum('amount'),
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit(User $user)
    {
        $user->load(['department', 'position']);
        $departments = Department::all();
        $positions = Position::all();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'departments' => $departments,
            'positions' => $positions
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        // Debug log
        Log::info('User Update Request:', [
            'user_id' => $user->id,
            'request_data' => $request->all(),
            'has_image' => $request->hasFile('image')
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'employee_id' => 'nullable|string|max:50|unique:users,employee_id,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'is_active' => 'boolean',
            'is_super_admin' => 'boolean',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        try {
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'employee_id' => $request->employee_id,
                'phone' => $request->phone,
                'address' => $request->address,
                'hire_date' => $request->hire_date,
                'salary' => $request->salary,
                'department_id' => $request->department_id,
                'position_id' => $request->position_id,
                'is_active' => $request->boolean('is_active'),
                'is_super_admin' => $request->boolean('is_super_admin'),
            ];

            // Handle password update
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image_path && Storage::disk('public')->exists($user->image_path)) {
                    Storage::disk('public')->delete($user->image_path);
                }

                // Store new image
                $imagePath = $request->file('image')->store('users', 'public');
                $updateData['image_path'] = $imagePath;
            }

            Log::info('Update Data:', $updateData);

            $user->update($updateData);

            return redirect()->route('admin.users.index')
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            Log::error('User Update Error:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->withErrors(['error' => 'Error updating user: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Don't allow deleting the current user
        if ($user->id === Auth::user()->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Don't allow deleting other super admins
        if ($user->is_super_admin) {
            return back()->with('error', 'Cannot delete super admin accounts.');
        }

        // Check for related records that would prevent deletion
        $hasRelatedRecords = false;
        $relatedRecords = [];

        // Check for employee histories
        if ($user->employeeHistory()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Employee History (' . $user->employeeHistory()->count() . ' records)';
        }

        // Check for attendance records
        if ($user->attendance()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Attendance (' . $user->attendance()->count() . ' records)';
        }

        // Check for salary payments
        if ($user->salaryPayments()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Salary Payments (' . $user->salaryPayments()->count() . ' records)';
        }

        // Check for product deliveries
        if ($user->productDeliveries()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Product Deliveries (' . $user->productDeliveries()->count() . ' records)';
        }

        // Check for collections
        if ($user->collections()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Collections (' . $user->collections()->count() . ' records)';
        }

        // Check for expenses
        if ($user->expenses()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Expenses (' . $user->expenses()->count() . ' records)';
        }

        // Check for balance sheets
        if ($user->balanceSheets()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Balance Sheets (' . $user->balanceSheets()->count() . ' records)';
        }

        // Check for employee stocks
        if ($user->employeeStocks()->count() > 0) {
            $hasRelatedRecords = true;
            $relatedRecords[] = 'Employee Stocks (' . $user->employeeStocks()->count() . ' records)';
        }

        if ($hasRelatedRecords) {
            $message = 'Cannot delete user because they have related records: ' . implode(', ', $relatedRecords) . '. Please deactivate the user instead or remove related records first.';
            return back()->with('error', $message);
        }

        try {
            $user->delete();
            return redirect()->route('admin.users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting user: ' . $e->getMessage());
        }
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(User $user)
    {
        // Don't allow deactivating the current user
        if ($user->id === Auth::user()->id) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        try {
            $user->update(['is_active' => !$user->is_active]);

            $status = $user->is_active ? 'activated' : 'deactivated';
            return back()->with('success', "User {$status} successfully.");
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating user status: ' . $e->getMessage());
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(User $user)
    {
        try {
            $newPassword = 'password123'; // You might want to generate a random password
            $user->update(['password' => Hash::make($newPassword)]);

            return back()->with('success', "Password reset successfully. New password: {$newPassword}");
        } catch (\Exception $e) {
            return back()->with('error', 'Error resetting password: ' . $e->getMessage());
        }
    }
}
