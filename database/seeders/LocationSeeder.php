<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Thana;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // Sample data for Dhaka
        $dhaka = District::create(['name' => 'Dhaka']);

        $dhakaCity = Upazila::create([
            'name' => 'Dhaka City',
            'district_id' => $dhaka->id
        ]);

        Thana::create([
            'name' => 'Uttara',
            'upazila_id' => $dhakaCity->id
        ]);

        Thana::create([
            'name' => 'Mirpur',
            'upazila_id' => $dhakaCity->id
        ]);

        Thana::create([
            'name' => 'Gulshan',
            'upazila_id' => $dhakaCity->id
        ]);

        $savar = Upazila::create([
            'name' => 'Savar',
            'district_id' => $dhaka->id
        ]);

        Thana::create([
            'name' => 'Savar Model',
            'upazila_id' => $savar->id
        ]);

        // Sample data for Chittagong
        $chittagong = District::create(['name' => 'Chittagong']);

        $chittagongCity = Upazila::create([
            'name' => 'Chittagong City',
            'district_id' => $chittagong->id
        ]);

        Thana::create([
            'name' => 'Kotwali',
            'upazila_id' => $chittagongCity->id
        ]);

        Thana::create([
            'name' => 'Double Mooring',
            'upazila_id' => $chittagongCity->id
        ]);

        // Add more districts, upazilas, and thanas as needed
    }
}
