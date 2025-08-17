<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\PropertyController;

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    
    // User management routes
    Route::apiResource('users', UserController::class);
});

// Property routes (some public, some protected)
Route::get('properties', [PropertyController::class, 'index']); // Public - browse properties
Route::get('properties/{property}', [PropertyController::class, 'show']); // Public - view property details

Route::middleware('auth:sanctum')->group(function () {
    Route::post('properties', [PropertyController::class, 'store']); // Protected - create property
    Route::put('properties/{property}', [PropertyController::class, 'update']); // Protected - update property
    Route::delete('properties/{property}', [PropertyController::class, 'destroy']); // Protected - delete property
});

// Contact landlord endpoint
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/contact-landlord', function (Request $request) {
        // This is a placeholder - you can implement the actual logic
        return response()->json([
            'success' => true,
            'message' => 'Contact request sent successfully'
        ]);
    });
});