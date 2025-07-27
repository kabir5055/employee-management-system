<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('commission_rate', 5, 2)->default(0)->after('status');
            $table->integer('minimum_quantity')->default(10)->after('stock_quantity');
            $table->integer('maximum_quantity')->default(100)->after('minimum_quantity');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['commission_rate', 'minimum_quantity', 'maximum_quantity']);
        });
    }
};
