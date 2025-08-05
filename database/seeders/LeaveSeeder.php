<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Leave;
use App\Models\User;
use Carbon\Carbon;

class LeaveSeeder extends Seeder
{
    public function run()
    {
        $employees = \App\Models\Employee::where('status', 'active')->get();
        $supervisors = \App\Models\Employee::where('status', 'active')->get();

        if ($employees->isEmpty()) {
            $this->command->warn('Skipping LeaveSeeder - need employees to be seeded first');
            return;
        }

        $leaveTypes = ['annual', 'sick', 'casual', 'maternity', 'paternity', 'emergency'];
        $statuses = ['pending', 'approved', 'rejected'];

        $leaveReasons = [
            'annual' => [
                'Summer vacation with family',
                'Wedding ceremony attendance',
                'Personal travel and relaxation',
                'Festival celebration',
                'Family reunion',
                'Educational course completion'
            ],
            'sick' => [
                'Fever and flu symptoms',
                'Medical check-up and treatment',
                'Recovery from surgery',
                'Dental treatment',
                'Eye treatment',
                'Back pain treatment'
            ],
            'casual' => [
                'Personal urgent work',
                'Home maintenance work',
                'Banking and official work',
                'Family function attendance',
                'Vehicle repair',
                'Property documentation'
            ],
            'maternity' => [
                'Maternity leave for childbirth',
                'Pre-natal medical care',
                'Post-delivery recovery',
                'Newborn care requirements'
            ],
            'paternity' => [
                'Paternity leave for newborn care',
                'Supporting spouse during childbirth',
                'Family care responsibilities'
            ],
            'emergency' => [
                'Family medical emergency',
                'Death in family',
                'Natural disaster impact',
                'Accident recovery',
                'Legal proceedings attendance',
                'Property emergency repair'
            ]
        ];

        // Create 100 leave applications
        for ($i = 0; $i < 100; $i++) {
            $employee = $employees->random();
            $leaveType = $leaveTypes[array_rand($leaveTypes)];
            $status = $statuses[array_rand($statuses)];

            // Generate date ranges
            $startDate = Carbon::now()->subDays(rand(1, 180))->addDays(rand(0, 90));
            $endDate = $startDate->copy()->addDays(rand(1, 15));
            $totalDays = $startDate->diffInDays($endDate) + 1;

            $leave = [
                'employee_id' => $employee->id,
                'leave_type' => $leaveType,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'total_days' => $totalDays,
                'reason' => $leaveReasons[$leaveType][array_rand($leaveReasons[$leaveType])],
                'status' => $status,
                'created_at' => $startDate->copy()->subDays(rand(7, 30)),
                'updated_at' => $startDate->copy()->subDays(rand(1, 7))
            ];

            // If approved or rejected, add approval data
            if (in_array($status, ['approved', 'rejected'])) {
                $leave['approved_by'] = $supervisors->random()->id;
                $leave['approved_date'] = $startDate->copy()->subDays(rand(1, 5))->format('Y-m-d');

                if ($status === 'approved') {
                    $leave['approval_remarks'] = 'Leave approved. Please ensure handover is completed.';
                } else {
                    $leave['approval_remarks'] = 'Leave rejected due to operational requirements during this period.';
                }
            }

            Leave::create($leave);
        }

        $this->command->info('Leave applications created successfully!');
    }
}
