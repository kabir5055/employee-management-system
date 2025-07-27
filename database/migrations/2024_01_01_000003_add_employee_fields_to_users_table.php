<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id')->unique()->after('id');
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->date('date_of_birth')->nullable()->after('address');
            $table->date('joining_date')->after('date_of_birth');
            $table->date('leaving_date')->nullable()->after('joining_date');
            $table->unsignedBigInteger('department_id')->nullable()->after('leaving_date');
            $table->unsignedBigInteger('position_id')->nullable()->after('department_id');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('position_id');
            $table->enum('role', ['admin', 'hr', 'employee'])->default('employee')->after('status');
            $table->string('nid_number')->nullable()->after('role');
            $table->decimal('current_salary', 10, 2)->default(0)->after('nid_number');
            
            $table->foreign('department_id')->references('id')->on('departments');
            $table->foreign('position_id')->references('id')->on('positions');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['position_id']);
            $table->dropColumn([
                'employee_id', 'phone', 'address', 'date_of_birth', 
                'joining_date', 'leaving_date', 'department_id', 
                'position_id', 'status', 'role', 'nid_number', 'current_salary'
            ]);
        });
    }
};