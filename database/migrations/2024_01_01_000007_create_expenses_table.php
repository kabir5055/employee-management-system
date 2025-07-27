<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('category'); // marketing, transport, meals, etc
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            $table->text('description');
            $table->string('receipt_image')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            
            $table->foreign('employee_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('expenses');
    }
};