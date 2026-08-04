<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if no record exists (idempotent)
        Setting::firstOrCreate([], [
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
        ]);
    }
}
