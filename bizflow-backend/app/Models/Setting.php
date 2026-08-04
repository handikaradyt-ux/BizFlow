<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'business_name',
        'business_address',
        'business_phone',
        'business_email',
        'currency',
        'currency_symbol',
        'currency_position',
        'tax_rate',
        'decimal_places',
        'thousand_separator',
        'invoice_prefix',
        'low_stock_threshold',
        'timezone',
        'date_format',
        'theme',
        'logo_path',
    ];

    protected $casts = [
        'tax_rate'            => 'float',
        'decimal_places'      => 'integer',
        'low_stock_threshold' => 'integer',
    ];
}
