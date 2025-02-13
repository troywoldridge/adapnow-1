<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wishlist;

class WishlistController extends Controller
{
    /**
     * Get the wishlist status for a specific product.
     *
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWishlistStatus($productId)
    {
        $userId = auth()->id(); // Get the authenticated user ID
        $isInWishlist = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['isInWishlist' => $isInWishlist]);
    }

    /**
     * Add a product to the wishlist.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addToWishlist(Request $request)
    {
        $request->validate(['product_id' => 'required|integer']);
        $userId = auth()->id();

        Wishlist::create([
            'user_id' => $userId,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Product added to wishlist.']);
    }

    /**
     * Remove a product from the wishlist.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeFromWishlist(Request $request)
    {
        $request->validate(['product_id' => 'required|integer']);
        $userId = auth()->id();

        Wishlist::where('user_id', $userId)
            ->where('product_id', $request->product_id)
            ->delete();

        return response()->json(['message' => 'Product removed from wishlist.']);
    }
}
