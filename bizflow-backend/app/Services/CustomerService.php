<?php

namespace App\Services;

use App\DTOs\CustomerDTO;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;

class CustomerService
{
    public function getAll(): Collection
    {
        return Customer::latest()->get();
    }

    public function create(CustomerDTO $dto): Customer
    {
        return Customer::create(
            $dto->toArray()
        );
    }

    public function update(Customer $customer, CustomerDTO $dto): Customer
    {
        $customer->update(
            $dto->toArray()
        );

        return $customer->fresh();
    }

    public function delete(Customer $customer): void
    {
        $customer->delete();
    }
}