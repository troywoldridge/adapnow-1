<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use App\Models\PricingCombination;

class PricingController extends Controller
{
    public function getPricing(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'combination' => 'required|array',
        ]);

        $combinationHash = md5(implode('-', $request->input('combination')));

        $pricing = PricingCombination::where('product_id', $request->input('product_id'))
            ->where('hash', $combinationHash)
            ->first();

        if (!$pricing) {
            return response()->json(['message' => 'No pricing found'], 404);
        }

        return response()->json($pricing);
    }
}

