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
        Schema::table('departments', function (Blueprint $table) {
            $table->string('head_of_department')->nullable()->after('description');
            $table->decimal('budget', 15, 2)->nullable()->after('head_of_department');
            $table->string('location')->nullable()->after('budget');
            $table->string('email')->nullable()->after('location');
            $table->string('phone')->nullable()->after('email');
            $table->boolean('is_active')->default(true)->after('phone');

            $table->index(['name', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn([
                'head_of_department',
                'budget',
                'location',
                'email',
                'phone',
                'is_active'
            ]);
        });
    }
};
