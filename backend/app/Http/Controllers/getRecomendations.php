<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class getRecomendations extends Controller
{
    public function getRecommendations($productId)

    $recommendation = AIRecommendation::where('product_id', $productId)->first();

    if (!$recommendation) {
        return response()->json(['message' => 'No recommendations available'], 404);
    }

    return response()->json(json_decode($recommendation->recommended_products, true));
}


