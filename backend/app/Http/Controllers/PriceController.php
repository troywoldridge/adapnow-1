<?php

namespace App\Http\Controllers\API\v1\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class PriceController extends Controller
{
    /**
     * Calculate product price based on selected options.
     */
    public function calculatePrice(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'options' => 'array', // Expecting an array of option IDs
        ]);

        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Base price
        $basePrice = $product->price;

        // Sum up price modifiers from selected options
        $optionModifiers = 0.0;
        if (!empty($request->options)) {
            $optionModifiers = DB::table('product_option_details')
                ->whereIn('id', $request->options)
                ->sum('price_modifier');
        }

        $totalPrice = $basePrice + $optionModifiers;

        return response()->json(['price' => $totalPrice]);
    }
}
