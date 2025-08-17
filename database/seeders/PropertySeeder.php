<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = [
            [
                'title' => 'Modern 2-Bedroom Apartment in Kampala',
                'description' => 'Beautiful modern apartment with city views, fully furnished with modern amenities.',
                'price' => 800000,
                'currency' => 'UGX',
                'bedrooms' => 2,
                'amenities' => json_encode(['WiFi', 'Parking', 'Security', 'Water Supply']),
                'address' => 'Kololo, Kampala',
                'district' => 'Kampala',
                'landlord_name' => 'John Ssemakula',
                'landlord_phone' => '+256 700 123456',
                'landlord_verified' => true,
                'available' => true,
            ],
            [
                'title' => 'Spacious 3-Bedroom House in Ntinda',
                'description' => 'Large family house with garden, perfect for families. Close to schools and shopping centers.',
                'price' => 1200000,
                'currency' => 'UGX',
                'bedrooms' => 3,
                'amenities' => json_encode(['WiFi', 'Parking', 'Garden', 'Security', 'Water Supply']),
                'address' => 'Ntinda, Kampala',
                'district' => 'Kampala',
                'landlord_name' => 'Mary Nakamura',
                'landlord_phone' => '+256 701 234567',
                'landlord_verified' => true,
                'available' => true,
            ],
            [
                'title' => 'Studio Apartment in Muyenga',
                'description' => 'Cozy studio apartment perfect for single professionals. Great location with easy transport access.',
                'price' => 400000,
                'currency' => 'UGX',
                'bedrooms' => 1,
                'amenities' => json_encode(['WiFi', 'Security', 'Water Supply']),
                'address' => 'Muyenga, Kampala',
                'district' => 'Kampala',
                'landlord_name' => 'David Musoke',
                'landlord_phone' => '+256 702 345678',
                'landlord_verified' => false,
                'available' => true,
            ],
            [
                'title' => '4-Bedroom Villa in Bugolobi',
                'description' => 'Luxury villa with swimming pool, perfect for executives. Fully furnished with premium amenities.',
                'price' => 2500000,
                'currency' => 'UGX',
                'bedrooms' => 4,
                'amenities' => json_encode(['WiFi', 'Parking', 'Swimming Pool', 'Security', 'Water Supply', 'Generator']),
                'address' => 'Bugolobi, Kampala',
                'district' => 'Kampala',
                'landlord_name' => 'Sarah Namuli',
                'landlord_phone' => '+256 703 456789',
                'landlord_verified' => true,
                'available' => true,
            ],
            [
                'title' => '2-Bedroom Apartment in Jinja',
                'description' => 'Nice apartment near the Nile, perfect for those working in Jinja. Quiet neighborhood.',
                'price' => 600000,
                'currency' => 'UGX',
                'bedrooms' => 2,
                'amenities' => json_encode(['WiFi', 'Parking', 'Security', 'Water Supply']),
                'address' => 'Jinja Central',
                'district' => 'Jinja',
                'landlord_name' => 'Peter Waiswa',
                'landlord_phone' => '+256 704 567890',
                'landlord_verified' => true,
                'available' => true,
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
}
