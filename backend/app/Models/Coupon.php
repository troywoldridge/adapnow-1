<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'discount_percentage', 'is_active', 'expires_at'];

    /**
     * Check if the coupon is expired.
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    /**
     * Check if the coupon is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }
}
