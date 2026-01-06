<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Additional product images (JSON array of URLs)
            $table->json('images')->nullable()->after('image_url');

            // Product highlights/features (JSON array of feature strings)
            $table->json('features')->nullable()->after('images');

            // Origin/source information
            $table->string('origin')->nullable()->after('features');

            // Certifications (organic, halal, etc - JSON array)
            $table->json('certifications')->nullable()->after('origin');

            // Harvest/production date
            $table->date('harvest_date')->nullable()->after('certifications');

            // Product unit (kg, liter, piece, etc)
            $table->string('unit')->default('kg')->after('price');

            // Minimum order quantity
            $table->integer('min_order')->default(1)->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'images',
                'features',
                'origin',
                'certifications',
                'harvest_date',
                'unit',
                'min_order'
            ]);
        });
    }
};
