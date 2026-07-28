<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CustomerDTO;
use App\Http\Controllers\Api\Base\BaseController;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;

class CustomerController extends BaseController
{
    public function __construct(
        protected CustomerService $service
    ) {}

    public function index()
    {
        return $this->success(
            CustomerResource::collection(
                $this->service->getAll()
            ),
            'Customers retrieved successfully'
        );
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = $this->service->create(
            CustomerDTO::fromArray(
                $request->validated()
            )
        );

        return $this->success(
            new CustomerResource($customer),
            'Customer created successfully',
            201
        );
    }

    public function show(Customer $customer)
    {
        return $this->success(
            new CustomerResource($customer),
            'Customer retrieved successfully'
        );
    }

    public function update(
        UpdateCustomerRequest $request,
        Customer $customer
    ) {
        $customer = $this->service->update(
            $customer,
            CustomerDTO::fromArray(
                $request->validated()
            )
        );

        return $this->success(
            new CustomerResource($customer),
            'Customer updated successfully'
        );
    }

    public function destroy(Customer $customer)
    {
        $this->service->delete($customer);

        return $this->success(
            null,
            'Customer deleted successfully'
        );
    }
}