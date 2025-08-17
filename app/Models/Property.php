<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'currency',
        'bedrooms',
        'amenities',
        'address',
        'district',
        'landlord_name',
        'landlord_phone',
        'landlord_verified',
        'available',
    ];

    protected $casts = [
        'amenities' => 'array',
        'available' => 'boolean',
        'landlord_verified' => 'boolean',
    ];
}
