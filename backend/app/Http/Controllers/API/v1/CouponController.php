<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
    /**
     * Validate and apply a coupon code.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'coupon' => 'required|string|max:255',
        ]);

        // Find the coupon
        $coupon = Coupon::where('code', $request->coupon)->first();

        // Check if coupon exists and is valid
        if (!$coupon || $coupon->isExpired() || !$coupon->isActive()) {
            return response()->json([
                'message' => 'Invalid or expired coupon code.',
            ], 400);
        }

        return response()->json([
            'discount' => $coupon->discount_percentage,
            'message' => 'Coupon applied successfully.',
        ]);
    }
}
