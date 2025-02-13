<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    /**
     * Fetch reviews for a specific product.
     *
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
public function getReviews($productId)
{
    $reviews = Review::where('product_id', $productId)
        ->with('user') // Eager load user info if needed
        ->get();

    if ($reviews->isEmpty()) {
        return response()->json(['reviews' => []], 200);
    }

    return response()->json(['reviews' => $reviews], 200);
}

}
