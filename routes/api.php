<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\District;
use App\Models\Upazila;

Route::get('/districts/{district}/upazilas', function (District $district) {
    return $district->upazilas;
});

Route::get('/upazilas/{upazila}/thanas', function (Upazila $upazila) {
    return $upazila->thanas;
});
