<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('position_id')->nullable()->constrained()->onDelete('set null');
            $table->string('employee_id')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->date('joining_date')->nullable();
            $table->string('nid')->nullable()->unique();
            $table->decimal('current_salary', 10, 2)->nullable();
            $table->enum('employment_status', ['active', 'inactive', 'terminated', 'on_leave'])->default('active');

            // Location fields
            $table->foreignId('district_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('upazila_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('thana_id')->nullable()->constrained()->onDelete('set null');

            $table->index(['department_id', 'position_id']);
            $table->index(['employment_status', 'joining_date']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['position_id']);
            $table->dropForeign(['district_id']);
            $table->dropForeign(['upazila_id']);
            $table->dropForeign(['thana_id']);

            $table->dropColumn([
                'department_id',
                'position_id',
                'employee_id',
                'phone',
                'address',
                'date_of_birth',
                'joining_date',
                'nid',
                'current_salary',
                'employment_status',
                'district_id',
                'upazila_id',
                'thana_id'
            ]);
        });
    }
};
