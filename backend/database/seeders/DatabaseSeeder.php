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
        }

        User::updateOrCreate(['email' => env('ADMIN_EMAIL', 'admin@sysnettechs.co.ke')], ['name' => 'Sysnettech Administrator', 'password' => Hash::make($password ?: 'LocalAdmin!2026'), 'role' => 'admin']);

        $services = [
            'POS Systems' => 'Smart, reliable sales and inventory solutions built for Kenyan businesses.',
            'CCTV & Surveillance' => 'Protect people, property and operations with intelligent, remote-ready security.',
            'Web Development' => 'Fast, scalable digital experiences and business applications that deliver results.',
            'Biometric Systems' => 'Accurate attendance and access control, integrated with your workflows.',
            'Computer Networking' => 'Secure, resilient connectivity engineered for uptime and business growth.',
            'School Management Systems' => 'Unified administration, learning, finance and parent communication for modern schools.',
            'Hospital Management Systems' => 'Secure clinical and operational workflows for hospitals, clinics and medical centres.',
            'ERP Solutions' => 'Integrated finance, inventory, procurement and operations built around one source of truth.',
            'Fleet Tracking' => 'Live fleet visibility, driver insights and operational controls that reduce risk and cost.',
            'GPS Tracking' => 'Dependable location monitoring and alerts for vehicles, equipment and valuable assets.',
            'Smart Home Automation' => 'Convenient, secure control of lighting, access, climate and entertainment at home.',
            'Smart Office Solutions' => 'Connected workplace technology that improves comfort, security and resource efficiency.',
            'Cloud Hosting' => 'Secure, scalable hosting for websites, applications and critical business workloads.',
            'Domain Registration' => 'Professional domain registration, renewal and DNS management for your digital identity.',
            'Email Hosting' => 'Reliable business email with professional addresses, security and administration support.',
            'Cybersecurity Services' => 'Layered protection, monitoring and practical controls for systems, users and business data.',
            'Data Backup & Disaster Recovery' => 'Tested backup and recovery plans that keep essential operations ready for disruption.',
            'IT Consultancy' => 'Independent technology guidance grounded in business priorities, risk and return.',
            'IT Outsourcing' => 'Flexible technical expertise that extends your team without adding unnecessary overhead.',
            'Managed IT Services' => 'Proactive monitoring, maintenance and support under one accountable service relationship.',
        ];
        foreach ($services as $title => $excerpt) {
            Content::updateOrCreate(
                ['type' => 'services', 'slug' => Str::slug($title)],
                ['title' => $title, 'excerpt' => $excerpt, 'body' => $excerpt, 'status' => 'published', 'published_at' => now()]
            );
        }

        foreach (['Multi-Branch Retail POS', 'Smart Factory Surveillance', 'Hospital Operations Portal'] as $title) {
            Content::updateOrCreate(['type' => 'projects', 'slug' => Str::slug($title)], ['title' => $title, 'excerpt' => 'A scalable implementation delivered for a Kenyan organisation.', 'status' => 'published', 'published_at' => now()]);
        }$careers = [
            ['ICT Support Engineer', 'Support client infrastructure, users and field deployments with responsive troubleshooting and clear documentation.', 'Full-time', 'Nairobi', 10],
            ['Business Development Executive', 'Build trusted client relationships, understand operational needs and coordinate practical ICT proposals.', 'Full-time', 'Nairobi', 20],
            ['Software Developer Intern', 'Contribute to web applications, testing and documentation while learning from production delivery work.', 'Internship', 'Hybrid', 30],
        ];
        foreach ($careers as [$title, $excerpt, $employmentType, $location, $sortOrder]) {
            Content::updateOrCreate(['type' => 'careers', 'slug' => Str::slug($title)], ['title' => $title, 'excerpt' => $excerpt, 'body' => $excerpt, 'data' => ['employment_type' => $employmentType, 'location' => $location], 'status' => 'published', 'sort_order' => $sortOrder, 'published_at' => now()]);
        }

        $posts = [
            [
                'How to Choose the Right POS System for Your Business',
                'A practical guide to features, integrations and support considerations for Kenyan retailers.',
                'Business Technology',
                "A point-of-sale platform should support the way your business actually operates. Begin with daily workflows: checkout speed, stock receiving, returns, reporting, user permissions and branch management.\n\nFor Kenyan businesses, payment integration and dependable local support matter as much as feature lists. Confirm how the system handles M-Pesa reconciliation, offline trading, tax configuration and backups before committing.\n\nChoose a platform that can grow without forcing a complete replacement. Ask for a structured demonstration using your real scenarios, a documented implementation plan and clear post-installation support terms.",
            ],
            [
                '7 Ways to Strengthen Your Office Network Security',
                'Simple, high-impact controls that protect your team, devices and customer data.',
                'Cybersecurity',
                "Strong network security starts with accurate visibility. Maintain an inventory of routers, switches, access points, servers and connected devices, then remove or isolate anything no longer required.\n\nUse unique administrator credentials, multi-factor authentication where supported, current firmware and separate networks for staff, guests and operational devices.\n\nBackups, monitoring and an incident response contact are equally important. Security is an operating discipline, so schedule regular reviews and test recovery procedures.",
            ],
            [
                'IP vs Analog CCTV: What Should You Install?',
                'Compare image quality, scalability and total ownership cost before investing.',
                'Surveillance',
                "Modern analog systems can be cost-effective for straightforward upgrades that reuse existing coaxial cabling. IP cameras provide greater resolution, flexible network deployment and stronger support for analytics.\n\nThe correct choice depends on coverage, retention, lighting, bandwidth, remote access and future expansion. Camera resolution alone does not determine evidential quality.\n\nRequest a site survey and a retention calculation before procurement. A professional design should document camera purpose, recording duration, user access and maintenance responsibilities.",
            ],
        ];
        foreach ($posts as [$title, $excerpt, $category, $body]) {
            Content::updateOrCreate(
                ['type' => 'posts', 'slug' => Str::slug($title)],
                ['title' => $title, 'excerpt' => $excerpt, 'body' => $body, 'data' => ['category' => $category], 'status' => 'published', 'published_at' => now()]
            );
        }

        $settings = ['site_title' => 'Sysnettech Solutions Ltd | ICT Solutions Kenya', 'meta_description' => 'Leading ICT solutions provider in Kenya for POS systems, CCTV, web development, biometric systems and secure computer networks.', 'og_image' => '/images/hero-ict.png', 'google_analytics_id' => '', 'facebook_url' => '', 'instagram_url' => '', 'linkedin_url' => ''];
        foreach ($settings as $key => $value) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
        $products = [
            ['CAM-IP4-T', '4MP IP Turret Camera', 'Cameras', 'Weather-resistant smart surveillance camera with night vision and remote viewing.', 12500, 18, '/images/products/ip-turret-camera.webp'],
            ['SWT-8P-POE', '8-Port Gigabit PoE Switch', 'Switches', 'Managed PoE network switch for cameras, access points and business devices.', 18900, 12, '/images/products/poe-switch.webp'],
            ['RTR-MTK-HEX', 'MikroTik hEX S Router', 'Routers', 'High-performance wired router with SFP, VPN and advanced traffic management.', 14500, 15, '/images/products/business-router.webp'],
            ['HDD-SURV-4T', '4TB Surveillance Hard Drive', 'Hard drives', 'Always-on storage engineered for DVR and NVR surveillance workloads.', 18500, 20, '/images/products/surveillance-hard-drive.webp'],
            ['POS-TOUCH-156', '15.6-inch Touch POS Terminal', 'POS hardware', 'Commercial touchscreen POS terminal for retail, hospitality and pharmacy operations.', 78000, 7, '/images/products/touch-pos-terminal.webp'],
            ['BIO-FACE-FP', 'Face & Fingerprint Attendance Terminal', 'Fingerprint scanners', 'Contactless face and fingerprint attendance device with access-control support.', 24500, 10, '/images/products/attendance-terminal.webp'],
            ['BAR-2D-WL', '2D Wireless Barcode Scanner', 'Barcode scanners', 'Fast wireless scanner for printed and mobile QR and barcodes.', 9800, 25, '/images/products/barcode-scanner.webp'],
            ['NET-CAT6-305', 'Cat6 UTP Cable — 305m', 'Network accessories', 'Solid copper structured-cabling roll for reliable gigabit network installations.', 22000, 14, '/images/products/cat6-cable.webp'],
        ];
        foreach ($products as [$sku, $name, $category, $description, $price, $stock, $image]) {
            Product::updateOrCreate(['sku' => $sku], ['slug' => Str::slug($name), 'name' => $name, 'category' => $category, 'description' => $description, 'price' => $price, 'stock_quantity' => $stock, 'image' => $image, 'is_active' => true]);
        }
    }
}
