<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return file_get_contents(public_path('index.html'));
});

// Catch all route for SPA (React Router)
Route::get('/{path}', function () {
    return file_get_contents(public_path('index.html'));
})->where('path', '.*');
