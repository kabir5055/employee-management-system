<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('upazilas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('district_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('thanas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('upazila_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Add location fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('district_id')->nullable()->constrained();
            $table->foreignId('upazila_id')->nullable()->constrained();
            $table->foreignId('thana_id')->nullable()->constrained();
            $table->string('designation')->nullable();
            $table->string('employee_code')->unique()->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['district_id']);
            $table->dropForeign(['upazila_id']);
            $table->dropForeign(['thana_id']);
            $table->dropColumn(['district_id', 'upazila_id', 'thana_id', 'designation', 'employee_code']);
        });

        Schema::dropIfExists('thanas');
        Schema::dropIfExists('upazilas');
        Schema::dropIfExists('districts');
    }
};
