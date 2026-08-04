<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Base\BaseController;
use App\Http\Requests\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;

class SettingController extends BaseController
{
    /**
     * Return the singleton settings record.
     * If no record exists yet, create one with defaults automatically.
     */
    public function show(): \Illuminate\Http\JsonResponse
    {
        $setting = Setting::firstOrCreate([], $this->defaults());

        return $this->success(new SettingResource($setting), 'Settings retrieved successfully.');
    }

    /**
     * Update the singleton settings record.
     * Uses updateOrCreate so the record is safe to call before the seeder runs.
     */
    public function update(UpdateSettingRequest $request): \Illuminate\Http\JsonResponse
    {
        $setting = Setting::firstOrCreate([], $this->defaults());
        $setting->update($request->validated());

        return $this->success(new SettingResource($setting), 'Settings updated successfully.');
    }

    /**
     * Default values used when no settings row exists yet.
     */
    private function defaults(): array
    {
        return [
            'business_name'       => 'BizFlow POS',
            'business_address'    => 'Jakarta',
            'business_phone'      => '08123456789',
            'business_email'      => 'admin@bizflow.test',
            'currency'            => 'IDR',
            'currency_symbol'     => 'Rp',
            'currency_position'   => 'prefix',
            'tax_rate'            => 11,
            'decimal_places'      => 0,
            'thousand_separator'  => '.',
            'invoice_prefix'      => 'INV',
            'low_stock_threshold' => 10,
            'timezone'            => 'Asia/Jakarta',
            'date_format'         => 'd/m/Y',
            'theme'               => 'light',
            'logo_path'           => null,
        ];
    }
}
