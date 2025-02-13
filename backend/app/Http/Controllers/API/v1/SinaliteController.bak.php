<?php


namespace App\Http\Controllers\API\v1;

use App\Services\SinaliteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Jobs\FetchSinaliteProductsJob;
use App\Http\Controllers\Controller;

class SinaliteController extends Controller
{
    protected $sinaliteService;

    public function __construct(SinaliteService $sinaliteService)
    {
        $this->sinaliteService = $sinaliteService;
    }

    public function getProducts(): JsonResponse
{
    try {
        $products = $this->sinaliteService->getAllProducts();
        return response()->json(['products' => $products], 200);
    } catch (\Exception $e) {
        Log::error('Error in getProducts: ' . $e->getMessage());
        return response()->json(['error' => 'Unable to fetch products'], 500);
    }
}

public function populateProductsTable(): JsonResponse
{
    try {
        $productList = $this->sinaliteService->getAllProducts();

        foreach ($productList as $product) {
            Product::updateOrCreate(
                ['sinalite_id' => $product['id']],
                [
                    'sku' => $product['sku'],
                    'name' => $product['name'],
                    'category' => $product['category'],
                    'enabled' => $product['enabled']
                ]
            );
        }

        Log::info('Products table populated successfully.');
        return response()->json(['message' => 'Products table populated successfully'], 200);
    } catch (\Exception $e) {
        Log::error('Error populating products table: ' . $e->getMessage());
        return response()->json(['error' => 'Error populating products table'], 500);
    }
}

    public function dispatchFetchProductsJob()
    {
        FetchSinaliteProductsJob::dispatch();
        return response()->json(['message' => 'Fetch Sinalite Products job dispatched successfully.'], 200);
    }
}
