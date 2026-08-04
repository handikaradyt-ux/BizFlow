<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name'       => ['required', 'string', 'max:255'],
            'business_address'    => ['nullable', 'string', 'max:500'],
            'business_phone'      => ['nullable', 'string', 'max:50'],
            'business_email'      => ['nullable', 'email', 'max:255'],
            'currency'            => ['required', 'string', 'max:10'],
            'currency_symbol'     => ['required', 'string', 'max:10'],
            'currency_position'   => ['required', 'in:prefix,suffix'],
            'tax_rate'            => ['required', 'numeric', 'min:0', 'max:100'],
            'decimal_places'      => ['required', 'integer', 'min:0', 'max:4'],
            'thousand_separator'  => ['required', 'string', 'max:5'],
            'invoice_prefix'      => ['required', 'string', 'max:20'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
            'timezone'            => ['required', 'string', 'timezone:all'],
            'date_format'         => ['required', 'string', 'max:20'],
            'theme'               => ['required', 'in:light,dark,system'],
        ];
    }

    public function messages(): array
    {
        return [
            'business_name.required'       => 'Business name is required.',
            'currency.required'            => 'Currency is required.',
            'currency_symbol.required'     => 'Currency symbol is required.',
            'currency_position.in'         => 'Currency position must be prefix or suffix.',
            'tax_rate.numeric'             => 'Tax rate must be a number.',
            'tax_rate.min'                 => 'Tax rate cannot be negative.',
            'tax_rate.max'                 => 'Tax rate cannot exceed 100%.',
            'decimal_places.integer'       => 'Decimal places must be a whole number.',
            'low_stock_threshold.integer'  => 'Low stock threshold must be a whole number.',
            'low_stock_threshold.min'      => 'Low stock threshold cannot be negative.',
            'timezone.timezone'            => 'Please enter a valid timezone (e.g. Asia/Jakarta).',
            'theme.in'                     => 'Theme must be light, dark, or system.',
            'currency_position.required'   => 'Currency position is required.',
            'theme.required'               => 'Theme is required.',
        ];
    }
}
