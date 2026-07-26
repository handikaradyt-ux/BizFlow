<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50000, 1000000);
        $tax = $subtotal * 0.11;

        return [
            'customer_id' => Customer::inRandomOrder()->first()?->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'grand_total' => $subtotal + $tax,
            'status' => fake()->randomElement([
                'pending',
                'completed',
                'cancelled',
            ]),
        ];
    }
}