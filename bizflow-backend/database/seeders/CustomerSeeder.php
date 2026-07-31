<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Customer::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $customers = [
            // Malang
            ['name' => 'Budi Santoso',       'phone' => '081234567801', 'email' => 'budi.santoso@gmail.com',    'address' => 'Jl. Soekarno Hatta No. 12, Malang'],
            ['name' => 'Siti Rahayu',        'phone' => '082134567802', 'email' => 'siti.rahayu@yahoo.com',     'address' => 'Jl. Veteran No. 45A, Malang'],
            ['name' => 'Agus Prasetyo',      'phone' => '083234567803', 'email' => 'agus.prasetyo@gmail.com',   'address' => 'Jl. MT Haryono No. 78, Malang'],
            ['name' => 'Dewi Kusuma',        'phone' => '081334567804', 'email' => 'dewi.kusuma@gmail.com',     'address' => 'Jl. Diponegoro No. 33, Malang'],
            ['name' => 'Rizky Firmansyah',   'phone' => '081534567805', 'email' => null,                        'address' => 'Jl. Letjend S. Parman No. 5, Malang'],

            // Surabaya
            ['name' => 'Hendra Wijaya',      'phone' => '082234567806', 'email' => 'hendra.wijaya@gmail.com',   'address' => 'Jl. Basuki Rahmat No. 101, Surabaya'],
            ['name' => 'Rina Kurniawati',    'phone' => '081734567807', 'email' => 'rina.kurnia@email.com',     'address' => 'Jl. Pemuda No. 27, Surabaya'],
            ['name' => 'Eko Cahyono',        'phone' => '083434567808', 'email' => 'eko.cahyono@gmail.com',     'address' => 'Jl. Raya Darmo No. 55, Surabaya'],
            ['name' => 'Mega Lestari',       'phone' => '085634567809', 'email' => 'mega.lestari@gmail.com',    'address' => 'Jl. Gubeng No. 18, Surabaya'],
            ['name' => 'Fajar Nugroho',      'phone' => '087834567810', 'email' => 'fajar.nugroho@yahoo.com',  'address' => 'Jl. Kertajaya Indah No. 3, Surabaya'],
            ['name' => 'Indah Permatasari',  'phone' => '081934567811', 'email' => null,                        'address' => 'Jl. HR Muhammad No. 88, Surabaya'],

            // Jakarta
            ['name' => 'Dian Pratiwi',       'phone' => '082334567812', 'email' => 'dian.pratiwi@gmail.com',   'address' => 'Jl. Sudirman No. 200, Jakarta Selatan'],
            ['name' => 'Andi Setiawan',      'phone' => '085834567813', 'email' => 'andi.setiawan@gmail.com',  'address' => 'Jl. Casablanca No. 15, Jakarta Selatan'],
            ['name' => 'Yulia Handayani',    'phone' => '087234567814', 'email' => 'yulia.h@email.com',        'address' => 'Jl. Kemang Raya No. 7, Jakarta Selatan'],
            ['name' => 'Rudi Hermawan',      'phone' => '081434567815', 'email' => 'rudi.hermawan@gmail.com',  'address' => 'Jl. Thamrin No. 50, Jakarta Pusat'],
            ['name' => 'Nova Anggraini',     'phone' => '082534567816', 'email' => null,                        'address' => 'Jl. Kelapa Gading No. 22, Jakarta Utara'],
            ['name' => 'Surya Wibowo',       'phone' => '089134567817', 'email' => 'surya.wibowo@gmail.com',   'address' => 'Jl. Cempaka Putih No. 9, Jakarta Pusat'],

            // Bandung
            ['name' => 'Lia Andriani',       'phone' => '082634567818', 'email' => 'lia.andriani@gmail.com',   'address' => 'Jl. Asia Afrika No. 77, Bandung'],
            ['name' => 'Tono Sugiarto',      'phone' => '085234567819', 'email' => 'tono.sugiarto@yahoo.com',  'address' => 'Jl. Riau No. 40, Bandung'],
            ['name' => 'Fitri Handiani',     'phone' => '081634567820', 'email' => 'fitri.h@gmail.com',        'address' => 'Jl. Laswi No. 13, Bandung'],
            ['name' => 'Anton Hidayat',      'phone' => '087034567821', 'email' => null,                        'address' => 'Jl. Pasteur No. 29, Bandung'],
            ['name' => 'Rahma Sari',         'phone' => '081834567822', 'email' => 'rahma.sari@gmail.com',     'address' => 'Jl. Braga No. 6, Bandung'],

            // Yogyakarta
            ['name' => 'Doni Saputra',       'phone' => '083134567823', 'email' => 'doni.saputra@gmail.com',   'address' => 'Jl. Malioboro No. 100, Yogyakarta'],
            ['name' => 'Wulan Ningrum',      'phone' => '082934567824', 'email' => 'wulan.n@email.com',        'address' => 'Jl. Kaliurang KM 5, Yogyakarta'],
            ['name' => 'Bagus Irmansyah',    'phone' => '085734567825', 'email' => 'bagus.irman@gmail.com',    'address' => 'Jl. Solo No. 44, Yogyakarta'],
            ['name' => 'Sri Wahyuni',        'phone' => '087634567826', 'email' => null,                        'address' => 'Jl. Mangkuyudan No. 8, Yogyakarta'],
            ['name' => 'Prapto Widodo',      'phone' => '081234567827', 'email' => 'prapto.widodo@gmail.com',  'address' => 'Jl. Wirobrajan No. 21, Yogyakarta'],

            // Semarang
            ['name' => 'Ningsih Susanti',    'phone' => '082034567828', 'email' => 'ningsih.s@gmail.com',      'address' => 'Jl. Pandanaran No. 35, Semarang'],
            ['name' => 'Lukman Hakim',       'phone' => '089334567829', 'email' => 'lukman.hakim@yahoo.com',   'address' => 'Jl. Pemuda No. 60, Semarang'],
            ['name' => 'Putri Rahmawati',    'phone' => '081334567830', 'email' => 'putri.rahma@gmail.com',    'address' => 'Jl. Gajah Mada No. 17, Semarang'],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
