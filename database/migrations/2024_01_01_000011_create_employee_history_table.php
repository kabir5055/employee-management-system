<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employee_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('action'); // joined, promoted, salary_change, resigned, terminated
            $table->text('description');
            $table->decimal('old_salary', 10, 2)->nullable();
            $table->decimal('new_salary', 10, 2)->nullable();
            $table->string('old_position')->nullable();
            $table->string('new_position')->nullable();
            $table->date('effective_date');
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('employee_histories');
    }
};
