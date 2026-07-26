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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->decimal('subtotal', 12, 2);

            $table->decimal('tax', 12, 2)->default(0);

            $table->decimal('grand_total', 12, 2);

            $table->enum('status', [
                'pending',
                'completed',
                'cancelled'
            ])->default('completed');

            $table->timestamps();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};