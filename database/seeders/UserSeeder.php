<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Superadmin
        User::updateOrCreate(
            ['email' => 'admin@agrimatch.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_SUPERADMIN,
            ]
        );

        // Create Petani for testing
        User::updateOrCreate(
            ['email' => 'petani@agrimatch.com'],
            [
                'name' => 'Petani Sukses',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_PETANI,
            ]
        );

        // Create Pembeli for testing
        User::updateOrCreate(
            ['email' => 'pembeli@agrimatch.com'],
            [
                'name' => 'Pembeli Setia',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_PEMBELI,
            ]
        );
    }
}
