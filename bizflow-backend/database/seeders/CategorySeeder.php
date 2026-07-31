<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Perangkat elektronik umum seperti televisi, radio, dan aksesori rumah tangga.',
            ],
            [
                'name' => 'Computer & Laptop',
                'description' => 'Laptop, desktop, dan perangkat komputasi lainnya untuk kebutuhan profesional maupun personal.',
            ],
            [
                'name' => 'Smartphone',
                'description' => 'Ponsel pintar dari berbagai merek ternama dengan spesifikasi terkini.',
            ],
            [
                'name' => 'Accessories',
                'description' => 'Aksesori perangkat elektronik seperti case, charger, kabel, dan pelindung layar.',
            ],
            [
                'name' => 'Office Supplies',
                'description' => 'Perlengkapan kantor seperti alat tulis, kertas, dan periferal komputer.',
            ],
            [
                'name' => 'Gaming',
                'description' => 'Perangkat gaming termasuk headset, mouse gaming, keyboard mekanikal, dan kontroler.',
            ],
            [
                'name' => 'Networking',
                'description' => 'Perangkat jaringan seperti router, switch, access point, dan kabel jaringan.',
            ],
            [
                'name' => 'Storage',
                'description' => 'Media penyimpanan data termasuk SSD, HDD, flashdisk, dan kartu memori.',
            ],
            [
                'name' => 'Printer',
                'description' => 'Printer inkjet, laser, dan aksesori cetak seperti tinta dan toner.',
            ],
            [
                'name' => 'Food & Beverage',
                'description' => 'Produk makanan dan minuman ringan untuk konsumsi sehari-hari.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}