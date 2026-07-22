<?php

namespace Database\Seeders;

use App\Models\Content;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_PASSWORD');
        if (! $password && app()->isProduction()) {
            throw new \RuntimeException('Set ADMIN_PASSWORD before production seeding.');
        }User::updateOrCreate(['email' => env('ADMIN_EMAIL', 'admin@sysnettechs.co.ke')], ['name' => 'Sysnettech Administrator', 'password' => Hash::make($password ?: 'LocalAdmin!2026'), 'role' => 'admin']);
        $services = ['POS Systems' => 'Smart sales, inventory and M-Pesa workflows.', 'CCTV & Surveillance' => 'Intelligent security and remote visibility.', 'Web Development' => 'Fast websites and custom business platforms.', 'Biometric Systems' => 'Accurate attendance and access control.', 'Computer Networking' => 'Secure, reliable business connectivity.'];
        foreach ($services as $title => $excerpt) {
            Content::updateOrCreate(['type' => 'services', 'slug' => Str::slug($title)], ['title' => $title, 'excerpt' => $excerpt, 'status' => 'published', 'published_at' => now()]);
        }foreach (['Multi-Branch Retail POS', 'Smart Factory Surveillance', 'Hospital Operations Portal'] as $title) {
            Content::updateOrCreate(['type' => 'projects', 'slug' => Str::slug($title)], ['title' => $title, 'excerpt' => 'A scalable implementation delivered for a Kenyan organisation.', 'status' => 'published', 'published_at' => now()]);
        }$settings = ['site_title' => 'Sysnettech Solutions Ltd | ICT Solutions Kenya', 'meta_description' => 'Leading ICT solutions provider in Kenya for POS systems, CCTV, web development, biometric systems and secure computer networks.', 'og_image' => '/images/hero-ict.png', 'google_analytics_id' => '', 'facebook_url' => '', 'instagram_url' => '', 'linkedin_url' => ''];
        foreach ($settings as $key => $value) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
        $products = [
            ['CAM-IP4-T', '4MP IP Turret Camera', 'Cameras', 'Weather-resistant smart surveillance camera with night vision and remote viewing.', 12500, 18],
            ['SWT-8P-POE', '8-Port Gigabit PoE Switch', 'Switches', 'Managed PoE network switch for cameras, access points and business devices.', 18900, 12],
            ['RTR-MTK-HEX', 'MikroTik hEX S Router', 'Routers', 'High-performance wired router with SFP, VPN and advanced traffic management.', 14500, 15],
            ['HDD-SURV-4T', '4TB Surveillance Hard Drive', 'Hard drives', 'Always-on storage engineered for DVR and NVR surveillance workloads.', 18500, 20],
            ['POS-TOUCH-156', '15.6-inch Touch POS Terminal', 'POS hardware', 'Commercial touchscreen POS terminal for retail, hospitality and pharmacy operations.', 78000, 7],
            ['BIO-FACE-FP', 'Face & Fingerprint Attendance Terminal', 'Fingerprint scanners', 'Contactless face and fingerprint attendance device with access-control support.', 24500, 10],
            ['BAR-2D-WL', '2D Wireless Barcode Scanner', 'Barcode scanners', 'Fast wireless scanner for printed and mobile QR and barcodes.', 9800, 25],
            ['NET-CAT6-305', 'Cat6 UTP Cable — 305m', 'Network accessories', 'Solid copper structured-cabling roll for reliable gigabit network installations.', 22000, 14],
        ];
        foreach ($products as [$sku, $name, $category, $description, $price, $stock]) {
            Product::updateOrCreate(['sku' => $sku], ['slug' => Str::slug($name), 'name' => $name, 'category' => $category, 'description' => $description, 'price' => $price, 'stock_quantity' => $stock, 'is_active' => true]);
        }
    }
}
