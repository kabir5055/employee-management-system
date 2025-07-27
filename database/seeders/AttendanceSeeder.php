<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $employees = User::where('status', 'active')->get();
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        foreach ($employees as $employee) {
            $currentDate = $startDate->copy();

            while ($currentDate->lte($endDate)) {
                // Skip weekends (Saturday = 6, Sunday = 0)
                if ($currentDate->dayOfWeek === 0 || $currentDate->dayOfWeek === 6) {
                    $currentDate->addDay();
                    continue;
                }

                // Skip if employee hadn't joined yet
                if ($currentDate->lt(Carbon::parse($employee->joining_date))) {
                    $currentDate->addDay();
                    continue;
                }

                // 90% attendance rate
                if (rand(1, 100) <= 90) {
                    $checkIn = $currentDate->copy()->setTime(rand(8, 10), rand(0, 59));
                    $checkOut = $currentDate->copy()->setTime(rand(17, 19), rand(0, 59));

                    $workingHours = $checkOut->diffInHours($checkIn);
                    $overtimeHours = max(0, $workingHours - 8);

                    $status = 'present';
                    if ($checkIn->hour >= 10) {
                        $status = 'late';
                    } elseif ($workingHours < 4) {
                        $status = 'half_day';
                    }

                    Attendance::create([
                        'employee_id' => $employee->id,
                        'date' => $currentDate->toDateString(),
                        'check_in' => $checkIn->format('H:i'),
                        'check_out' => $checkOut->format('H:i'),
                        'working_hours' => $workingHours,
                        'overtime_hours' => $overtimeHours,
                        'status' => $status,
                        'remarks' => $status === 'late' ? 'Late arrival' : null,
                    ]);
                } else {
                    // Absent
                    Attendance::create([
                        'employee_id' => $employee->id,
                        'date' => $currentDate->toDateString(),
                        'check_in' => null,
                        'check_out' => null,
                        'working_hours' => 0,
                        'overtime_hours' => 0,
                        'status' => 'absent',
                        'remarks' => 'Absent',
                    ]);
                }

                $currentDate->addDay();
            }
        }
    }
}
