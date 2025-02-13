<?php

namespace App\Http\Controllers\API\v1\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    protected $cacheExpiry = 3600; // Cache expiry time in seconds (e.g., 1 hour)

    /**
     * Get all products.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $products = Cache::remember('all_products_with_active_images', $this->cacheExpiry, function () {
                return Product::with(['images' => function ($query) {
                    $query->where('is_active', 1); // Only fetch active images
                }])->get();
            });

            $products->each(function ($product) {
                $product->images->each(function ($image) {
                    $image->image_url = $image->full_image_url; // Ensure the correct URL
                });
            });

            return response()->json(['success' => true, 'products' => $products]);
        } catch (\Exception $e) {
            Log::error('Error fetching all products: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Error fetching products'], 500);
        }
    }


/**
     * Get all featured products.
     *
     * @return JsonResponse
     */
public function getFeaturedProducts()
{
    try {
        $products = Product::where('is_featured', true)
            ->with(['images' => function ($query) {
                $query->where('is_primary', true); // Fetch only primary images
            }])
            ->get(['id', 'name', 'sku', 'description', 'category']);

        // Replace S3 URL with CloudFront URL
        $cloudfrontBaseUrl = 'https://d14tdt0nyb8r45.cloudfront.net';

        $products->each(function ($product) use ($cloudfrontBaseUrl) {
            $product->image_url = $product->images->first()
                ? $cloudfrontBaseUrl . '/' . $product->images->first()->s3_key
                : null;
        });

        return response()->json(['success' => true, 'products' => $products]);
    } catch (\Exception $e) {
        Log::error('Error fetching featured products: ' . $e->getMessage());
        return response()->json(['error' => 'Something went wrong'], 500);
    }
}
    /**
     * Get a specific product by ID.
     *
     * @param int|string $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $product = Product::with([
                'images' => function ($query) {
                    $query->where('is_active', 1); // Ensure images are active
                },
                'options', // Ensure options are included
            ])->findOrFail($id);

            $product->images->each(function ($image) {
                $image->image_url = $image->full_image_url; // Ensure image URL
            });

            return response()->json(['success' => true, 'product' => $product]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'error' => 'Product not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching product: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Error fetching product details'], 500);
        }
    }
   public function getOptions($id)
{
    // Fetch valid option IDs from product_option_chains
    $optionChain = ProductOptionChain::where('product_id', $id)->first();

    if (!$optionChain) {
        return response()->json(['error' => 'No options available for this product.'], 404);
    }

    // Convert option_chain string to array
    $validOptionIds = explode("-", $optionChain->option_chain);

    // Fetch only the options that are in the valid option IDs
    $options = ProductOption::where('product_id', $id)
                            ->whereIn('identifier', $validOptionIds)
                            ->get();

    // Group options by category (size, qty, coating, turnaround, etc.)
    $groupedOptions = [];
    foreach ($options as $option) {
        $groupedOptions[$option->group][] = [
            "id" => $option->id,
            "name" => $option->name
        ];
    }

    return response()->json([
        'options' => $groupedOptions
    ]);
}


}
