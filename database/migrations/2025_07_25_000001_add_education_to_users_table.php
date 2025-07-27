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
        Schema::table('users', function (Blueprint $table) {
            $table->string('education_level')->nullable()->after('nid_number');
            $table->string('institution')->nullable()->after('education_level');
            $table->year('graduation_year')->nullable()->after('institution');
            $table->string('major_subject')->nullable()->after('graduation_year');
            $table->text('certifications')->nullable()->after('major_subject');
            $table->text('skills')->nullable()->after('certifications');
            $table->text('experience_summary')->nullable()->after('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'education_level',
                'institution',
                'graduation_year',
                'major_subject',
                'certifications',
                'skills',
                'experience_summary'
            ]);
        });
    }
};
