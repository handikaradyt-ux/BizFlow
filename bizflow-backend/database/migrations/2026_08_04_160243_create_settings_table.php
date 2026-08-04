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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->text('business_address')->nullable();
            $table->string('business_phone')->nullable();
            $table->string('business_email')->nullable();
            $table->string('currency', 10)->default('IDR');
            $table->string('currency_symbol', 10)->default('Rp');
            $table->string('currency_position', 10)->default('prefix');
            $table->decimal('tax_rate', 5, 2)->default(11);
            $table->unsignedTinyInteger('decimal_places')->default(0);
            $table->string('thousand_separator', 5)->default('.');
            $table->string('invoice_prefix', 20)->default('INV');
            $table->unsignedSmallInteger('low_stock_threshold')->default(10);
            $table->string('timezone')->default('Asia/Jakarta');
            $table->string('date_format', 20)->default('d/m/Y');
            $table->string('theme', 20)->default('light');
            $table->string('logo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
