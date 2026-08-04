<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'business_name'       => $this->business_name,
            'business_address'    => $this->business_address,
            'business_phone'      => $this->business_phone,
            'business_email'      => $this->business_email,
            'currency'            => $this->currency,
            'currency_symbol'     => $this->currency_symbol,
            'currency_position'   => $this->currency_position,
            'tax_rate'            => $this->tax_rate,
            'decimal_places'      => $this->decimal_places,
            'thousand_separator'  => $this->thousand_separator,
            'invoice_prefix'      => $this->invoice_prefix,
            'low_stock_threshold' => $this->low_stock_threshold,
            'timezone'            => $this->timezone,
            'date_format'         => $this->date_format,
            'theme'               => $this->theme,
            'logo_url'            => $this->logo_path
                ? Storage::disk('public')->url($this->logo_path)
                : null,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
        ];
    }
}
