<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApplyDiscount extends Controller
{
    public function applyDiscount(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'combination' => 'required|array',
        'coupon_code' => 'nullable|string',
    ]);

    $combinationHash = md5(implode('-', $request->input('combination')));

    $pricing = PricingCombination::where('product_id', $request->input('product_id'))
        ->where('hash', $combinationHash)
        ->first();

    if (!$pricing) {
        return response()->json(['message' => 'No pricing found'], 404);
    }

    $price = $pricing->price;

    // Check for discount
    if ($request->filled('coupon_code')) {
        $discount = Discount::where('code', $request->input('coupon_code'))
            ->where('expires_at', '>', now())
            ->first();

        if ($discount) {
            if ($discount->discount_type === 'percentage') {
                $price -= ($price * $discount->discount_value) / 100;
            } else {
                $price -= $discount->discount_value;
            }
        }
    }

    return response()->json(['price' => max($price, 0)]);
}

}
