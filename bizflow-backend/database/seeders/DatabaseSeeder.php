<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,   // Must run first — creates the admin user
            CategorySeeder::class,    // ProductSeeder depends on categories existing
            ProductSeeder::class,     // Depends on CategorySeeder
            CustomerSeeder::class,    // Independent
            SettingSeeder::class,     // App settings — singleton row
        ]);
    }
}
