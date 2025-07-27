<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['employee.department', 'employee.position']);
        
        // Filter by month
        if ($request->has('month') && $request->month) {
            $date = Carbon::parse($request->month);
            $query->forMonth($date->year, $date->month);
        } else {
            $query->forMonth(Carbon::now()->year, Carbon::now()->month);
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
        
        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        $attendances = $query->orderBy('date', 'desc')->paginate(20);
        
        // Summary statistics
        $totalRecords = $query->count();
        $presentCount = $query->present()->count();
        $absentCount = $query->absent()->count();
        $lateCount = $query->where('status', 'late')->count();
        $attendancePercentage = $totalRecords > 0 ? ($presentCount / $totalRecords) * 100 : 0;
        
        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances,
            'summary' => [
                'total_records' => $totalRecords,
                'present_count' => $presentCount,
                'absent_count' => $absentCount,
                'late_count' => $lateCount,
                'attendance_percentage' => round($attendancePercentage, 2),
            ],
            'filters' => $request->only(['search', 'month', 'department', 'status']),
        ]);
    }
    
    public function show(Attendance $attendance)
    {
        $attendance->load(['employee.department', 'employee.position']);
        
        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance,
        ]);
    }
    
    public function export(Request $request)
    {
        $query = Attendance::with(['employee.department', 'employee.position']);
        
        // Apply same filters as index
        if ($request->has('month') && $request->month) {
            $date = Carbon::parse($request->month);
            $query->forMonth($date->year, $date->month);
        } else {
            $query->forMonth(Carbon::now()->year, Carbon::now()->month);
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
            $query->where('status', $request->status);
        }
        
        $attendances = $query->get();
        
        $csvData = [];
        $csvData[] = [
            'Employee ID', 'Name', 'Department', 'Date', 'Check In', 'Check Out',
            'Working Hours', 'Overtime Hours', 'Status', 'Remarks'
        ];
        
        foreach ($attendances as $attendance) {
            $csvData[] = [
                $attendance->employee->employee_id,
                $attendance->employee->name,
                $attendance->employee->department->name,
                $attendance->date->format('Y-m-d'),
                $attendance->check_in,
                $attendance->check_out,
                $attendance->working_hours,
                $attendance->overtime_hours,
                $attendance->status,
                $attendance->remarks,
            ];
        }
        
        $month = $request->month ?? Carbon::now()->format('Y-m');
        $filename = 'attendance_' . $month . '_' . date('Y-m-d_H-i-s') . '.csv';
        
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