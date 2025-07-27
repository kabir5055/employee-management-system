<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EmployeeHistory;
use App\Models\Department;
use App\Models\Position;
use App\Models\Thana;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory;

class EmployeeSeeder extends Seeder
{
    private $faker;
    private $departments;
    private $positions;
    private $thanas;

    private $firstNames = [
        'Abdul', 'Mohammed', 'Ahmed', 'Rahman', 'Islam',
        'Hossain', 'Akter', 'Begum', 'Khatun', 'Sultana',
        'Nasrin', 'Fatima', 'Amina', 'Rahima', 'Salma'
    ];

    private $lastNames = [
        'Khan', 'Ahmed', 'Rahman', 'Hossain', 'Islam',
        'Chowdhury', 'Miah', 'Sheikh', 'Molla', 'Sarkar',
        'Siddique', 'Haque', 'Alam', 'Uddin', 'Hassan'
    ];

    private $educations = [
        'BSc in CSE from BUET',
        'BBA from Dhaka University',
        'MBA from IBA',
        'BSc in EEE from RUET',
        'BBA from North South University',
        'MSc in Economics from Dhaka University',
        'BSS from Jagannath University',
        'Bachelor of Pharmacy from Dhaka University',
        'BSc in Textile Engineering from BUTEX',
        'BBA from East West University'
    ];

    private $phonePrefixes = ['017', '018', '016', '019', '015', '013'];

    public function __construct()
    {
        $this->faker = Factory::create('bn_BD');
    }

    public function run(): void
    {
        // Load required data
        $this->loadDependencies();

        // Create employees
        $this->createEmployees();
    }

    private function loadDependencies(): void
    {
        $this->departments = Department::all();
        $this->positions = Position::all();
        $this->thanas = Thana::with('upazila.district')->get();
    }

    private function createEmployees(): void
    {
        $startDate = Carbon::now()->subYears(5);
        $endDate = Carbon::now();

        for ($i = 0; $i < 100; $i++) {
            $joinDate = $this->generateDate($startDate, $endDate);
            $hasLeft = rand(1, 100) <= 30;
            $leaveDate = $hasLeft ? $this->generateDate($joinDate, Carbon::now()) : null;

            $employee = $this->createEmployee($i + 1, $joinDate, $hasLeft);
            $this->createInitialPosition($employee, $joinDate, $hasLeft, $leaveDate);

            if ($this->shouldHavePositionChanges()) {
                $this->createPositionHistory($employee, $joinDate, $hasLeft, $leaveDate);
            }

            $this->createBalanceSheet($employee, $joinDate);

            if ($hasLeft) {
                $this->markAsInactive($employee, $leaveDate);
            }
        }
    }

    private function generateDate($startDate, $endDate): Carbon
    {
        return Carbon::createFromTimestamp(
            rand($startDate->timestamp, $endDate->timestamp)
        );
    }

    private function createEmployee(int $index, Carbon $joinDate, bool $hasLeft): User
    {
        $employeeCode = 'EMP' . str_pad($index, 4, '0', STR_PAD_LEFT);

        $employee = User::create([
            'employee_id' => $employeeCode,
            'name' => $this->faker->randomElement($this->firstNames) . ' ' .
                     $this->faker->randomElement($this->lastNames),
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'),
            'phone' => $this->faker->randomElement($this->phonePrefixes) .
                      $this->faker->numberBetween(10000000, 99999999),
            'address' => $this->faker->address,
            'education' => $this->faker->randomElement($this->educations),
            'joining_date' => $joinDate,
            'status' => $hasLeft ? 'inactive' : 'active',
            'employee_code' => $employeeCode,
        ]);

        $employee->assignRole('employee');
        return $employee;
    }

    private function createInitialPosition(User $employee, Carbon $joinDate, bool $hasLeft, ?Carbon $endDate): void
    {
        $department = $this->departments->random();
        $position = $this->positions->where('department_id', $department->id)->random();
        $thana = $this->thanas->random();

        EmployeeHistory::create([
            'employee_id' => $employee->id,
            'department_id' => $department->id,
            'position_id' => $position->id,
            'thana_id' => $thana->id,
            'start_date' => $joinDate,
            'end_date' => null,
            'salary' => $this->faker->numberBetween(25000, 120000),
            'designation' => $position->name,
            'status' => 'active'
        ]);
    }

    private function shouldHavePositionChanges(): bool
    {
        return rand(1, 100) <= 40;
    }

    private function createPositionHistory(User $employee, Carbon $joinDate, bool $hasLeft, ?Carbon $endDate): void
    {
        $numChanges = rand(1, 3);
        $lastChangeDate = $joinDate;

        for ($j = 0; $j < $numChanges; $j++) {
            $changeDate = $this->generateDate(
                $lastChangeDate->copy()->addMonths(6),
                $endDate ?? Carbon::now()
            );

            $this->closeCurrentPosition($employee, $changeDate);
            $this->createNewPosition($employee, $changeDate, $hasLeft, $endDate);

            $lastChangeDate = $changeDate;
        }
    }

    private function closeCurrentPosition(User $employee, Carbon $changeDate): void
    {
        EmployeeHistory::where('employee_id', $employee->id)
            ->whereNull('end_date')
            ->update(['end_date' => $changeDate]);
    }

    private function createNewPosition(User $employee, Carbon $changeDate, bool $hasLeft, ?Carbon $endDate): void
    {
        $newDepartment = $this->departments->random();
        $newPosition = $this->positions->where('department_id', $newDepartment->id)->random();
        $newThana = $this->thanas->random();

        EmployeeHistory::create([
            'employee_id' => $employee->id,
            'department_id' => $newDepartment->id,
            'position_id' => $newPosition->id,
            'thana_id' => $newThana->id,
            'start_date' => $changeDate,
            'end_date' => $hasLeft ? $endDate : null,
            'salary' => $this->faker->numberBetween(25000, 120000),
            'designation' => $newPosition->name,
            'status' => $hasLeft ? 'inactive' : 'active'
        ]);
    }

    private function createBalanceSheet(User $employee, Carbon $joinDate): void
    {
        $thana = $this->thanas->random();
        $employee->balanceSheet()->create([
            'opening_balance' => 0,
            'current_balance' => 0,
            'date' => $joinDate,
            'location' => $thana->name . ', ' . $thana->upazila->name . ', ' .
                         $thana->upazila->district->name,
        ]);
    }

    private function markAsInactive(User $employee, Carbon $endDate): void
    {
        EmployeeHistory::where('employee_id', $employee->id)
            ->whereNull('end_date')
            ->update([
                'end_date' => $endDate,
                'status' => 'inactive'
            ]);
    }
}
