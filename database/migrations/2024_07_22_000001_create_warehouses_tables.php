<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address')->nullable();
            $table->foreignId('thana_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        Schema::create('warehouse_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity')->default(0);
            $table->integer('minimum_quantity')->default(10);
            $table->integer('maximum_quantity')->default(100);
            $table->timestamps();

            $table->unique(['warehouse_id', 'product_id']);
        });

        // Add warehouse_id to product_deliveries table
        Schema::table('product_deliveries', function (Blueprint $table) {
            $table->foreignId('warehouse_id')->after('product_id')->constrained()->cascadeOnDelete();
        });

        // Add warehouse_id to collections table
        Schema::table('collections', function (Blueprint $table) {
            $table->foreignId('warehouse_id')->after('delivery_id')->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('collections', function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn('warehouse_id');
        });

        Schema::table('product_deliveries', function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn('warehouse_id');
        });

        Schema::dropIfExists('warehouse_inventories');
        Schema::dropIfExists('warehouses');
    }
};
