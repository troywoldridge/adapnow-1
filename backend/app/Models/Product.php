<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        'sinalite_id', 'sku', 'name', 'category', 'enabled', 'base_price', 'description', 
        'slug', 'is_featured', 'is_trending',
    ];

    /**
     * Boot method for the model to handle slug generation.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Convert the model instance to an array for searchable indexing in Laravel Scout.
     *
     * @return array
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing('categories'); // Eager load relationships if needed for search

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'base_price' => $this->base_price,
            'sku' => $this->sku,
            'category' => $this->category,
            'categories' => $this->categories->pluck('name')->toArray(),
        ];
    }

    /**
     * Define the relationship to the images associated with the product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class)->where('is_active', 1);
    }

    /**
     * Relationship to Subcategory.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class, 'subcategory_id');
    }

    /**
     * Relationship to Category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relationship: One-to-Many with ProductOption.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function options()
    {
        return $this->hasMany(ProductOption::class);
    }

    /**
     * Relationship: One-to-One with ProductPricing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pricing()
    {
        return $this->hasOne(ProductPricing::class);
    }

    /**
     * Relationship: Many-to-Many with Category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Scope to retrieve only active products.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('enabled', 1);
    }

    /**
     * Scope to retrieve featured products.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', 1);
    }

    /**
     * Calculate the final price of the product based on selected options.
     *
     * @param array $options Array of option adjustments, each containing 'adjustment_value'.
     * @return float
     */
    public function calculatePrice(array $options = []): float
    {
        $finalPrice = $this->base_price;

        foreach ($options as $option) {
            $finalPrice += $option['adjustment_value'] ?? 0;
        }

        return $finalPrice;
    }

   public function wishlistUsers()
   {
        return $this->hasMany(Wishlist::class);
   }

}
