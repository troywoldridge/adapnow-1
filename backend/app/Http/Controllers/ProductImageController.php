<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    /**
     * Retrieve images for a product by product ID.
     */
    public function getImagesByProductId($productId)
    {
        $images = ProductImage::whereHas('products', function ($query) use ($productId) {
            $query->where('product_id', $productId); // Check if product image belongs to the given product
        })->where('is_active', 1)->get(); // Ensure images are active

        if ($images->isEmpty()) {
            return response()->json(['message' => 'No active images found for this product'], 404);
        }

        // Optionally, you can format the response to include full URLs or additional metadata
        $images->each(function ($image) {
            $image->image_url = $image->full_image_url; // Assuming full_image_url is a method on the model
        });

        return response()->json($images);
    }

    /**
     * Store new images.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            's3_key' => 'required|string',
            'image_url' => 'required|url',
        ]);

        $image = ProductImage::create($data);
        return response()->json($image, 201);
    }
}
