<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use App\Models\Customization;

class CustomizationController extends Controller
{
    public function saveCustomization(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'customization_data' => 'required|array',
        ]);

        $customization = auth()->user()->customizations()->create([
            'product_id' => $request->input('product_id'),
            'customization_data' => $request->input('customization_data'),
        ]);

        return response()->json($customization);
    }

    public function getCustomizations()
    {
        $customizations = auth()->user()->customizations()->with('product')->get();
        return response()->json($customizations);
    }
}
