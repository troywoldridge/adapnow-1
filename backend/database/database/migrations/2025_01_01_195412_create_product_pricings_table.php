<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductPricingsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_pricings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id'); // FK to products table
            $table->string('hash')->unique();        // Unique hash for combinations
            $table->decimal('value', 10, 2);         // Price value
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_pricings');
    }
}
