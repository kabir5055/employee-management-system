<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('delivery_id');
            $table->decimal('amount_collected', 10, 2);
            $table->date('collection_date');
            $table->text('notes')->nullable();
            $table->enum('payment_method', ['cash', 'bank', 'mobile_banking'])->default('cash');
            $table->timestamps();
            
            $table->foreign('employee_id')->references('id')->on('users');
            $table->foreign('delivery_id')->references('id')->on('product_deliveries');
        });
    }

    public function down()
    {
        Schema::dropIfExists('collections');
    }
};