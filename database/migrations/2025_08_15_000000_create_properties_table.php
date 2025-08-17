<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('currency')->default('UGX');
            $table->integer('bedrooms')->default(1);
            $table->json('amenities')->nullable();
            $table->string('address');
            $table->string('district');
            $table->string('landlord_name');
            $table->string('landlord_phone');
            $table->boolean('landlord_verified')->default(false);
            $table->boolean('available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
