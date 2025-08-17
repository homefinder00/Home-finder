<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    // List all properties
    public function index()
    {
        $properties = Property::all()->map(function ($property) {
            return [
                'id' => (string) $property->id,
                'title' => $property->title,
                'description' => $property->description,
                'price' => (float) $property->price,
                'currency' => $property->currency,
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms ?? 1, // Default to 1 if not set
                'location' => [
                    'address' => $property->address,
                    'latitude' => 0.3476, // Default Kampala coordinates
                    'longitude' => 32.5825,
                    'district' => $property->district,
                ],
                'images' => [], // Empty for now, can be added later
                'video' => null,
                'amenities' => is_string($property->amenities) ? json_decode($property->amenities, true) : $property->amenities,
                'landlordId' => (string) ($property->user_id ?? 1), // Default landlord ID
                'landlordName' => $property->landlord_name,
                'landlordPhone' => $property->landlord_phone,
                'landlordVerified' => $property->landlord_verified,
                'available' => $property->available,
                'createdAt' => $property->created_at->toISOString(),
                'updatedAt' => $property->updated_at->toISOString(),
            ];
        });

        // Add basic caching headers
        return response()->json($properties)
            ->header('Cache-Control', 'public, max-age=60') // Cache for 1 minute
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
