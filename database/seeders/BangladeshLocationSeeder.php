<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Upazila;
use App\Models\Thana;
use Illuminate\Database\Seeder;

class BangladeshLocationSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        // Major districts in Bangladesh
        $districts = [
            'Dhaka' => [
                'Dhaka City' => ['Mirpur', 'Uttara', 'Gulshan', 'Dhanmondi', 'Mohammadpur', 'Banani'],
                'Savar' => ['Savar Sadar', 'Ashulia', 'Birulia'],
                'Gazipur' => ['Gazipur Sadar', 'Tongi', 'Kaliganj']
            ],
            'Chittagong' => [
                'Chittagong City' => ['Patenga', 'Halishahar', 'Agrabad', 'Pahartali'],
                'Cox\'s Bazar' => ['Cox\'s Bazar Sadar', 'Teknaf', 'Ukhia'],
                'Comilla' => ['Comilla Sadar', 'Chandina', 'Daudkandi']
            ],
            'Rajshahi' => [
                'Rajshahi City' => ['Boalia', 'Motihar', 'Shah Makhdum'],
                'Bogra' => ['Bogra Sadar', 'Gabtoli', 'Sherpur']
            ],
            'Khulna' => [
                'Khulna City' => ['Sonadanga', 'Khalishpur', 'Daulatpur'],
                'Jessore' => ['Jessore Sadar', 'Abhaynagar', 'Keshabpur']
            ],
            'Sylhet' => [
                'Sylhet City' => ['Sylhet Sadar', 'South Surma', 'Bishwanath'],
                'Moulvibazar' => ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura']
            ],
            'Barisal' => [
                'Barisal City' => ['Barisal Sadar', 'Babuganj', 'Wazirpur'],
                'Patuakhali' => ['Patuakhali Sadar', 'Kalapara', 'Galachipa']
            ]
        ];

        foreach ($districts as $districtName => $upazilas) {
            $district = District::create(['name' => $districtName]);

            foreach ($upazilas as $upazilaName => $thanas) {
                $upazila = Upazila::create([
                    'district_id' => $district->id,
                    'name' => $upazilaName
                ]);

                foreach ($thanas as $thanaName) {
                    Thana::create([
                        'upazila_id' => $upazila->id,
                        'name' => $thanaName
                    ]);
                }
            }
        }
    }
}
