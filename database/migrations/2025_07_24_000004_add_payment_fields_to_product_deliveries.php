<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('product_deliveries', function (Blueprint $table) {
            $table->enum('payment_status', ['paid', 'unpaid'])->default('unpaid')->after('status');
            $table->decimal('commission_amount', 10, 2)->default(0)->after('payment_status');
        });
    }

    public function down()
    {
        Schema::table('product_deliveries', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'commission_amount']);
        });
    }
};
