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
        Schema::table('positions', function (Blueprint $table) {
            // Rename title to name
            $table->renameColumn('title', 'name');

            // Remove department_id foreign key
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');

            // Rename base_salary and add min/max salary
            $table->renameColumn('base_salary', 'min_salary');
            $table->decimal('max_salary', 10, 2)->nullable()->after('min_salary');

            // Update grade to level with enum
            $table->dropColumn('grade');
            $table->enum('level', ['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'])->default('entry')->after('max_salary');

            // Add new fields
            $table->text('description')->nullable()->after('name');
            $table->json('requirements')->nullable()->after('level');
            $table->boolean('is_active')->default(true)->after('requirements');

            $table->index(['name', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            $table->renameColumn('name', 'title');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->renameColumn('min_salary', 'base_salary');
            $table->dropColumn(['max_salary', 'level', 'description', 'requirements', 'is_active']);
            $table->string('grade')->after('base_salary');
        });
    }
};
