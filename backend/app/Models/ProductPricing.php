<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ProductPricing extends Model
{
    use HasFactory;

    protected $fillable = [
    'product_id',
    'hash',      // Unique identifier for combinations
    'value',     // Pricing value
    'created_at',
    'updated_at',
];

        

    // Relationships

    // Relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Logic for Calculating the Final Price

    public function calculateFinalPrice()
    {
        // Calculate final price based on base price and discount
        return $this->base_price - ($this->discount ?? 0);
    }

    // Logic to update pricing based on options provided by Sinalite

    public function updatePricingBasedOnOptions($productOptions)
    {
        // Placeholder for the logic that updates pricing based on selected options
        // e.g., Make an API call to Sinalite with $productOptions to retrieve pricing details

        // Assuming an API response structure, you could do something like this:
         $response = $this->fetchPriceFromSinaliteApi($productOptions);

         // Update fields based on the response from the API
         $this->final_price = $response['price'];
         $this->package_total_weight = $response['packageInfo']['total weight'];
         $this->weight_per_box = $response['packageInfo']['weight per box'];
         $this->units_per_box = $response['packageInfo']['Units Per Box'];
         $this->box_size = $response['packageInfo']['box size'];
         $this->number_of_boxes = $response['packageInfo']['number of boxes'];
         $this->turnaround_time = $response['productOptions']['Turnaround'];

        $this->save();
    }

    // Logic for Sinalite API call to get dynamic pricing (mock example)

    protected function fetchPriceFromSinaliteApi($productOptions)
    {
        // Here you would write the logic to make the POST request to Sinalite's /price endpoint
        // Include the authorization token and pass the options array

        // For example:
         $response = Http::withHeaders([
             'Authorization' => $this->getSinaliteAccessToken()
         ])->post(env('SINALITE_API_URL') . "/price/{$this->product_id}/en_us", [
             'productOptions' => $productOptions
         ]);

         if ($response->successful()) {
             return $response->json();
         } else {
             throw new \Exception('Failed to fetch pricing from Sinalite API');
         }

        // Placeholder return (for testing without API calls)
        return [
            'price' => 5.28,
            'packageInfo' => [
                'total weight' => 0.33,
                'weight per box' => 0.33,
                'Units Per Box' => 1000,
                'box size' => '7 x 4 x 4',
                'number of boxes' => 1,
            ],
            'productOptions' => [
                'Turnaround' => '2 - 3 Business Days'
            ]
        ];
    }

    // Helper function to get the Sinalite access token
    protected function getSinaliteAccessToken()
    {
        // Logic to retrieve access token, for example by calling a SinaliteService or Cache
        // Placeholder implementation
        return Cache::get('sinalite_token');
    }
}
