<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('balance_sheets', function (Blueprint $table) {
            if (!Schema::hasColumn('balance_sheets', 'date')) {
                $table->date('date')->after('employee_id');
            }
            if (!Schema::hasColumn('balance_sheets', 'location')) {
                $table->string('location')->nullable()->after('date');
            }
            if (!Schema::hasColumn('balance_sheets', 'product_delivery_amount')) {
                $table->decimal('product_delivery_amount', 10, 2)->default(0)->after('current_balance');
            }
            if (!Schema::hasColumn('balance_sheets', 'expense_amount')) {
                $table->decimal('expense_amount', 10, 2)->default(0)->after('product_delivery_amount');
            }
            if (!Schema::hasColumn('balance_sheets', 'market_cost')) {
                $table->decimal('market_cost', 10, 2)->default(0)->after('expense_amount');
            }
            if (!Schema::hasColumn('balance_sheets', 'ta_da')) {
                $table->decimal('ta_da', 10, 2)->default(0)->after('market_cost');
            }
            if (!Schema::hasColumn('balance_sheets', 'notes')) {
                $table->text('notes')->nullable()->after('ta_da');
            }
            if (!Schema::hasColumn('balance_sheets', 'updated_by')) {
                $table->foreignId('updated_by')->nullable()->constrained('users');
            }
        });
    }

    public function down()
    {
        Schema::table('balance_sheets', function (Blueprint $table) {
            $table->dropColumn([
                'date',
                'location',
                'product_delivery_amount',
                'expense_amount',
                'market_cost',
                'ta_da',
                'notes'
            ]);
            $table->dropForeign(['updated_by']);
            $table->dropColumn('updated_by');
        });
    }
};
