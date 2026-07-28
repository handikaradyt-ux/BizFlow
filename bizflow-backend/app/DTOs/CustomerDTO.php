<?php

namespace App\DTOs;

class CustomerDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $phone,
        public readonly ?string $email,
        public readonly ?string $address,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            phone: $data['phone'],
            email: $data['email'] ?? null,
            address: $data['address'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
        ];
    }
}