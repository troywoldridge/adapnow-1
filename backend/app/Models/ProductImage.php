<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductImage extends Model
{
    use HasFactory;

    protected $table = 'product_images';
    protected $fillable = ['s3_key', 'image_url', 'alt_text', 'is_primary', 'is_active', 'title'];

    /**
     * Relationship: Define the relationship to Product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_image_product', 'product_image_id', 'product_id');
    }

    /**
     * Accessor for the full image URL.
     *
     * @return string
     */
    public function getFullImageUrlAttribute()
    {
        // Define CloudFront base URL
        $baseUrl = 'https://d2gmuctit90cqi.cloudfront.net';

        // If 's3_key' is available, return the CloudFront URL
        if ($this->s3_key) {
            return $baseUrl . '/' . rawurlencode($this->s3_key);
        }

        // If 'image_url' exists (legacy or alternative storage), use it.
        return $this->image_url ?? 'https://via.placeholder.com/150';
    }

    /**
     * Scope to only get active images.
     *
     * @param $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    /**
     * Scope to only get primary images.
     *
     * @param $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', 1);
    }
}
