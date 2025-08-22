<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    // List all properties (optimized for speed)
    public function index()
    {
        // Direct database query for maximum speed
        $properties = DB::table('properties')
            ->select([
                'id', 'title', 'description', 'price', 'currency', 
                'bedrooms', 'amenities', 'address', 'district',
                'landlord_name', 'landlord_phone', 'landlord_verified',
                'available', 'created_at', 'updated_at'
            ])
            ->where('available', true)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => (string) $property->id,
                    'title' => $property->title,
                    'description' => $property->description,
                    'price' => (float) $property->price,
                    'currency' => $property->currency,
                    'bedrooms' => $property->bedrooms,
                    'bathrooms' => 1,
                    'location' => [
                        'address' => $property->address,
                        'latitude' => 0.3476,
                        'longitude' => 32.5825,
                        'district' => $property->district,
                    ],
                    'images' => [],
                    'video' => null,
                    'amenities' => json_decode($property->amenities, true) ?: [],
                    'landlordId' => "1",
                    'landlordName' => $property->landlord_name,
                    'landlordPhone' => $property->landlord_phone,
                    'landlordVerified' => (bool) $property->landlord_verified,
                    'available' => (bool) $property->available,
                    'createdAt' => $property->created_at,
                    'updatedAt' => $property->updated_at,
                ];
            });

        return response()->json($properties, 200, [
            'Cache-Control' => 'public, max-age=300',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        ]);
    }

    // Store a new property
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'currency' => 'required|string',
            'bedrooms' => 'required|integer',
            'amenities' => 'nullable|array',
            'address' => 'required|string',
            'district' => 'required|string',
            'landlord_name' => 'required|string',
            'landlord_phone' => 'required|string',
            'landlord_verified' => 'boolean',
            'available' => 'boolean',
        ]);
        $property = Property::create($validated);
        return response()->json($property, 201);
    }
}
