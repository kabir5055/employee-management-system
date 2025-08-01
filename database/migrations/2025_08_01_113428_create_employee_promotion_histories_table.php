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
        Schema::create('employee_promotion_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Previous position and department
            $table->foreignId('previous_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->foreignId('previous_department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->decimal('previous_salary', 10, 2)->nullable();

            // New position and department
            $table->foreignId('new_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->foreignId('new_department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->decimal('new_salary', 10, 2)->nullable();

            // Promotion details
            $table->enum('promotion_type', ['promotion', 'demotion', 'transfer', 'salary_change'])->default('promotion');
            $table->date('effective_date');
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();

            // Who approved/processed this change
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'effective_date']);
            $table->index(['promotion_type', 'effective_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_promotion_histories');
    }
};
