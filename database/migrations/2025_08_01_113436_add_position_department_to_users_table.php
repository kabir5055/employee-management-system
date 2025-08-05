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
            if (!Schema::hasColumn('users', 'department_id')) {
                $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            }
            if (!Schema::hasColumn('users', 'position_id')) {
                $table->foreignId('position_id')->nullable()->constrained()->onDelete('set null');
            }
            if (!Schema::hasColumn('users', 'employee_id')) {
                $table->string('employee_id')->nullable()->unique();
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('users', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable();
            }
            if (!Schema::hasColumn('users', 'joining_date')) {
                $table->date('joining_date')->nullable();
            }
            if (!Schema::hasColumn('users', 'nid')) {
                $table->string('nid')->nullable()->unique();
            }
            if (!Schema::hasColumn('users', 'current_salary')) {
                $table->decimal('current_salary', 10, 2)->nullable();
            }
            if (!Schema::hasColumn('users', 'employment_status')) {
                $table->enum('employment_status', ['active', 'inactive', 'terminated', 'on_leave'])->default('active');
            }

            // Location fields
            if (!Schema::hasColumn('users', 'district_id')) {
                $table->foreignId('district_id')->nullable()->constrained()->onDelete('set null');
            }
            if (!Schema::hasColumn('users', 'upazila_id')) {
                $table->foreignId('upazila_id')->nullable()->constrained()->onDelete('set null');
            }
            if (!Schema::hasColumn('users', 'thana_id')) {
                $table->foreignId('thana_id')->nullable()->constrained()->onDelete('set null');
            }

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
