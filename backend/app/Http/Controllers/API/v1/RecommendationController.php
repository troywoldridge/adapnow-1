<?php

// RecommendationController.php
namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class RecommendationController extends Controller
{
    public function getRecommendations(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $productId = $request->input('product_id');

        // Example logic: Recommend products in the same category
        $recommendations = Product::where('category_id', function ($query) use ($productId) {
            $query->select('category_id')
                ->from('products')
                ->where('id', $productId);
        })
        ->where('id', '!=', $productId) // Exclude the current product
        ->take(10) // Limit recommendations
        ->get();

        return response()->json($recommendations);
    }
}
