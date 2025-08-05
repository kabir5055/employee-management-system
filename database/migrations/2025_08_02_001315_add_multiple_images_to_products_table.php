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
        Schema::table('products', function (Blueprint $table) {
            // Add multiple images support
            $table->json('images')->nullable()->after('description'); // Store array of image paths
            $table->string('primary_image')->nullable()->after('images'); // Main display image

            // Remove stock-related fields as they'll be handled by purchase/sale modules
            $table->dropColumn(['stock_quantity', 'cost_price']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Restore stock fields
            $table->integer('stock_quantity')->default(0);
            $table->decimal('cost_price', 10, 2)->default(0);

            // Remove image fields
            $table->dropColumn(['images', 'primary_image']);
        });
    }
};
