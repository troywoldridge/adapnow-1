<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductPricing;

class SinaliteService
{
    protected $apiUrl;

    public function __construct()
    {
        // Fetch API URL from .env
        $this->apiUrl = env('SINALITE_API_URL');

        // Debugging logs for API URL
        Log::info('API URL (env): ' . env('SINALITE_API_URL'));
        Log::info('API URL (config): ' . config('services.sinalite.api_url'));
    }

    // ===============================
    // Fetch the Access Token
    // ===============================
public function getAccessToken()
{
    Log::info('Token Request:', [
        'url' => config('services.sinalite.token_url'),
        'data' => [
            'grant_type' => 'client_credentials',
            'client_id' => config('services.sinalite.client_id'),
            'client_secret' => config('services.sinalite.client_secret'),
            'audience' => config('services.sinalite.audience'),
        ],
    ]);

    try {
        $response = Http::withOptions([
            'force_ip_resolve' => 'v4', // Force IPv4
        ])->post(config('services.sinalite.token_url'), [
            'grant_type' => 'client_credentials',
            'client_id' => config('services.sinalite.client_id'),
            'client_secret' => config('services.sinalite.client_secret'),
            'audience' => config('services.sinalite.audience'),
        ]);

        Log::info('Token Response:', ['body' => $response->body()]);

        $body = json_decode($response->getBody(), true);

        if (isset($body['access_token'])) {
            Cache::put('sinalite_token', $body['access_token'], now()->addSeconds($body['expires_in'] ?? 3600));
            return $body['access_token'];
        }

        throw new \Exception('Access token missing');
    } catch (\Exception $e) {
        Log::error('Failed to fetch access token: ' . $e->getMessage());
        throw $e;
    }
}


    // ===============================
    // Fetch All Products
    // ===============================
    public function fetchProducts()
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Host' => 'adapnow.com',
            ])->get($this->apiUrl . '/products');

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Failed to fetch products: ' . $e->getMessage());
            return [];
        }
    }

    // ===============================
    // Fetch Product Details
    // ===============================
    public function fetchProductDetails($sinaliteProductId)
    {
        try {
            Log::info('Fetching Product Details for ID:', [$sinaliteProductId]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->getAccessToken(),
                'Host' => 'adapnow.com',
            ])->get($this->apiUrl . "/products/$sinaliteProductId");

            Log::info('API Response:', ['body' => $response->body()]);

            if ($response->failed()) {
                Log::error('Failed to fetch product details for ID ' . $sinaliteProductId, [
                    'status' => $response->status(),
                    'error' => $response->body()
                ]);
                throw new \Exception('Failed to fetch product details.');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Exception in fetchProductDetails: ' . $e->getMessage());
            throw $e;
        }
    }

    // ===============================
    // Sync Product Pricing
    // ===============================
    public function syncProductPricing($localProductId, $sinaliteProductId)
    {
        try {
            $details = $this->fetchProductDetails($sinaliteProductId);

            if (!isset($details[0]) || !isset($details[1])) {
                throw new \Exception('Product details are incomplete or missing required data.');
            }

            $options = collect($details[0])->groupBy('group');
            $pricingData = collect($details[1]);

            Log::info('Product Details:', ['details' => $details]);

            $optionCombinations = $this->generateCombinations($options);

            foreach ($optionCombinations as $combination) {
                $hash = implode('-', $combination);
                $priceData = $pricingData->firstWhere('hash', $hash);

                if ($priceData) {
                    ProductPricing::updateOrCreate(
                        [
                            'product_id' => $localProductId,
                            'hash' => $hash,
                        ],
                        [
                            'value' => $priceData['value'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }

            Log::info('Pricing sync completed for product ID: ' . $localProductId);
            return "Pricing synced successfully for product ID: $localProductId";
        } catch (\Exception $e) {
            Log::error('Pricing Sync Failed: ' . $e->getMessage());
            return "Pricing sync failed: " . $e->getMessage();
        }
    }

    // ===============================
    // Generate Combinations
    // ===============================
    protected function generateCombinations($options)
    {
        $optionGroups = $options->map(function ($group) {
            return $group->pluck('id')->toArray();
        })->values()->toArray();

        return $this->cartesianProduct($optionGroups);
    }

    /**
     * Helper function for Cartesian product
     *
     * @param array $input
     * @return array
     */
    protected function cartesianProduct($input)
    {
        $result = [[]];
        foreach ($input as $values) {
            $append = [];
            foreach ($result as $product) {
                foreach ($values as $item) {
                    $append[] = array_merge($product, [$item]);
                }
            }
            $result = $append;
        }
        return $result;
    }

    // ===============================
    // Get Pricing from API
    // ===============================
    public function getPricing($id, $data)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withOptions([
    'force_ip_resolve' => 'v4',
])->post(config('services.sinalite.token_url'), [
    'grant_type' => 'client_credentials',
    'client_id' => config('services.sinalite.client_id'),
    'client_secret' => config('services.sinalite.client_secret'),
    'audience' => config('services.sinalite.audience'),
]);


            return $response->json();
        } catch (\Exception $e) {
            Log::error('Failed to fetch pricing for product ID ' . $id . ': ' . $e->getMessage());
            return [];
        }
    }
}
