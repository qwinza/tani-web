<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $features = [
            [
                'icon' => 'ShoppingBag',
                'title' => 'Transaksi Langsung',
                'description' => 'Beli langsung dari petani tanpa perantara. Harga lebih baik untuk petani dan pembeli.',
                'color' => 'green',
            ],
            [
                'icon' => 'MapPin',
                'title' => 'Peta Petani',
                'description' => 'Temukan petani terdekat dengan peta interaktif. Lihat produk dan ketersediaan real-time.',
                'color' => 'blue',
            ],
            [
                'icon' => 'LayoutDashboard',
                'title' => 'Dashboard Petani',
                'description' => 'Kelola produk, pantau penjualan, dan analisis performa dengan dashboard yang intuitif.',
                'color' => 'purple',
            ],
            [
                'icon' => 'History',
                'title' => 'Riwayat Transaksi',
                'description' => 'Lacak semua transaksi dengan detail lengkap. Mudah untuk pembukuan dan referensi.',
                'color' => 'orange',
            ],
            [
                'icon' => 'Shield',
                'title' => 'Pembayaran Aman',
                'description' => 'Sistem pembayaran terenkripsi dengan berbagai metode. Uang aman sampai barang diterima.',
                'color' => 'cyan',
            ],
            [
                'icon' => 'Truck',
                'title' => 'Pengiriman Terlacak',
                'description' => 'Pantau pengiriman dari petani sampai ke tangan Anda dengan sistem tracking real-time.',
                'color' => 'pink',
            ],
            [
                'icon' => 'MessageCircle',
                'title' => 'Chat Langsung',
                'description' => 'Komunikasi langsung dengan petani untuk diskusi produk, negosiasi, atau pertanyaan.',
                'color' => 'indigo',
            ],
            [
                'icon' => 'BarChart3',
                'title' => 'Analisis Pasar',
                'description' => 'Akses data harga pasar dan tren untuk keputusan jual-beli yang lebih cerdas.',
                'color' => 'teal',
            ],
        ];

        foreach ($features as $feature) {
            \App\Models\Feature::updateOrCreate(
                ['title' => $feature['title']], // Key to check
                $feature                            // Values to update/create
            );
        }
    }
}
