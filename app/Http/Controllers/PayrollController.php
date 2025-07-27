<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $query = Payroll::with(['employee.department', 'employee.position']);
        
        // Filter by month
        if ($request->has('month') && $request->month) {
            $query->forMonth($request->month);
        } else {
            $query->forMonth(Carbon::now()->format('Y-m'));
        }
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('employee', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }
        
        // Filter by department
        if ($request->has('department') && $request->department) {
            $query->whereHas('employee', function($q) use ($request) {
                $q->where('department_id', $request->department);
            });
        }
        
        // Filter by payment status
        if ($request->has('status') && $request->status) {
            $query->where('payment_status', $request->status);
        }
        
        $payrolls = $query->orderBy('net_salary', 'desc')->paginate(20);
        
        // Summary statistics
        $totalGrossSalary = $query->sum('gross_salary');
        $totalNetSalary = $query->sum('net_salary');
        $totalDeductions = $query->sum('total_deductions');
        $paidCount = $query->where('payment_status', 'paid')->count();
        $pendingCount = $query->where('payment_status', 'pending')->count();
        
        return Inertia::render('Payroll/Index', [
            'payrolls' => $payrolls,
            'summary' => [
                'total_gross_salary' => $totalGrossSalary,
                'total_net_salary' => $totalNetSalary,
                'total_deductions' => $totalDeductions,
                'paid_count' => $paidCount,
                'pending_count' => $pendingCount,
            ],
            'filters' => $request->only(['search', 'month', 'department', 'status']),
        ]);
    }
    
    public function show(Payroll $payroll)
    {
        $payroll->load(['employee.department', 'employee.position']);
        
        return Inertia::render('Payroll/Show', [
            'payroll' => $payroll,
        ]);
    }
    
    public function export(Request $request)
    {
        $query = Payroll::with(['employee.department', 'employee.position']);
        
        // Apply same filters as index
        if ($request->has('month') && $request->month) {
            $query->forMonth($request->month);
        } else {
            $query->forMonth(Carbon::now()->format('Y-m'));
        }
        
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('employee', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('department') && $request->department) {
            $query->whereHas('employee', function($q) use ($request) {
                $q->where('department_id', $request->department);
            });
        }
        
        if ($request->has('status') && $request->status) {
            $query->where('payment_status', $request->status);
        }
        
        $payrolls = $query->get();
        
        $csvData = [];
        $csvData[] = [
            'Employee ID', 'Name', 'Department', 'Month', 'Basic Salary', 
            'House Rent', 'Medical Allowance', 'Transport Allowance', 'Overtime Amount',
            'Bonus', 'Gross Salary', 'Tax Deduction', 'Provident Fund', 
            'Other Deductions', 'Total Deductions', 'Net Salary', 'Payment Status'
        ];
        
        foreach ($payrolls as $payroll) {
            $csvData[] = [
                $payroll->employee->employee_id,
                $payroll->employee->name,
                $payroll->employee->department->name,
                $payroll->month,
                $payroll->basic_salary,
                $payroll->house_rent,
                $payroll->medical_allowance,
                $payroll->transport_allowance,
                $payroll->overtime_amount,
                $payroll->bonus,
                $payroll->gross_salary,
                $payroll->tax_deduction,
                $payroll->provident_fund,
                $payroll->other_deductions,
                $payroll->total_deductions,
                $payroll->net_salary,
                $payroll->payment_status,
            ];
        }
        
        $month = $request->month ?? Carbon::now()->format('Y-m');
        $filename = 'payroll_' . $month . '_' . date('Y-m-d_H-i-s') . '.csv';
        
        return Response::streamDownload(function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}