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
        Schema::create('security_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('event_type'); // e.g., login_failed, brute_force, unauthorized_access, sql_injection, xss_attempt, file_upload_blocked
            $table->string('ip_address', 45);
            $table->string('user_agent')->nullable();
            $table->text('details')->nullable();
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_alerts');
    }
};
