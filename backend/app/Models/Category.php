<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'description', 'is_top_category', 'slug'];

    /**
     * Boot method to handle automatic slug generation.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Relationship: Categories have many Subcategories.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class, 'category_id');
    }

    public function productsThroughSubcategories()
    {
        return $this->hasManyThrough(Product::class, Subcategory::class, 'category_id', 'subcategory_id');
    }
    /**
     * Relationship: Categories belong to many products directly (many-to-many).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_categories');
    }

    /**
     * Scope to get categories with their subcategories eagerly loaded.
     *
     * @param $query
     * @return mixed
     */
    public function scopeWithSubcategories($query)
    {
        return $query->with('subcategories');
    }
}
