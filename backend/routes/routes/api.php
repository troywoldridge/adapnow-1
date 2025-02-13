<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\v1\Products\ProductController;
use App\Http\Controllers\API\v1\Categories\CategoryController;
use App\Http\Controllers\API\v1\Orders\OrderController;
use App\Http\Controllers\API\v1\Users\WishlistController;
use App\Http\Controllers\API\v1\Shipping\ShippingAddressController;
use App\Http\Controllers\API\v1\Payment\PaymentController;
use App\Http\Controllers\API\v1\Auth\SessionController;
use App\Http\Controllers\API\v1\Auth\RegisterController;
use App\Http\Controllers\API\v1\Auth\Google2FAAuthController;
use App\Http\Controllers\API\v1\CheckoutController;
use App\Http\Controllers\API\v1\SubscriptionController;
use App\Http\Controllers\API\v1\ArtworkUploadController;
use App\Http\Controllers\API\v1\PricingController;
use App\Http\Controllers\API\v1\CustomizationController;
use App\Http\Controllers\API\v1\FilterController;
use App\Http\Controllers\API\v1\ReviewController;
use App\Http\Controllers\API\v1\RecommendationController;
use App\Http\Controllers\API\v1\GamificationController;
use App\Http\Controllers\API\v1\CouponController;
use App\Http\Controllers\SearchController;

// Test Routes
Route::get('/test', function () {
    return response()->json(['status' => 'working']);
});

Route::get('/ping', function () {
    return response()->json(['status' => 'success', 'message' => 'API is working!']);
});

// API v1 Routes
Route::prefix('v1')->group(function () {
    // Categories
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{idOrSlug}', [CategoryController::class, 'show']);
        Route::get('/top-categories', [CategoryController::class, 'getTopCategories']);
        Route::get('/{categoryId}/subcategories', [CategoryController::class, 'subcategories']);
        Route::get('/category-hierarchy', [CategoryController::class, 'getCategoryHierarchy']);
    });

    // Products
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/featured', [ProductController::class, 'getFeaturedProducts']);
        Route::get('/trending', [ProductController::class, 'getTrendingProducts']);
        Route::get('/active', [ProductController::class, 'activeProducts']);
        Route::get('/{id}', [ProductController::class, 'show']);
	Route::get('/product/{id}/options', [ProductController::class, 'getOptions']);
        Route::get('/product/{id}/pricing', [ProductController::class, 'getPricing']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/history', [OrderController::class, 'orderHistory']);
        Route::resource('order-items', OrderController::class)->except(['create', 'edit']);
    });

    // Wishlist
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/wishlist/{productId}', [WishlistController::class, 'getWishlistStatus']);
        Route::post('/wishlist', [WishlistController::class, 'addToWishlist']);
        Route::delete('/wishlist', [WishlistController::class, 'removeFromWishlist']);
    });

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/login', [SessionController::class, 'login']);
        Route::post('/register', [RegisterController::class, 'register']);
        Route::post('/2fa/setup', [Google2FAAuthController::class, 'setupGoogle2FA']);
        Route::post('/google-2fa/verify', [Google2FAAuthController::class, 'verify']);
    });

    // Shipping
    Route::prefix('shipping')->group(function () {
        Route::get('/addresses', [ShippingAddressController::class, 'index']);
        Route::post('/addresses', [ShippingAddressController::class, 'store']);
        Route::put('/addresses/{id}', [ShippingAddressController::class, 'update']);
        Route::delete('/addresses/{id}', [ShippingAddressController::class, 'destroy']);
    });

    // Payment
    Route::prefix('payment')->group(function () {
        Route::get('/methods', [PaymentController::class, 'getPaymentMethods']);
        Route::post('/methods', [PaymentController::class, 'store']);
        Route::delete('/methods/{id}', [PaymentController::class, 'destroy']);
    });

    // Checkout
    Route::post('/checkout', [CheckoutController::class, 'processCheckout']);

    // Subscriptions
    Route::prefix('subscriptions')->group(function () {
        Route::post('/', [SubscriptionController::class, 'store']);
        Route::post('/unsubscribe/{id}', [SubscriptionController::class, 'unsubscribe']);
        Route::post('/send-emails', [SubscriptionController::class, 'sendEmails']);
    });

    // Filters
    Route::get('/filters', [FilterController::class, 'index']);

    // Gamification
    Route::prefix('gamification')->group(function () {
        Route::post('/add-points', [GamificationController::class, 'addPoints']);
        Route::get('/rewards/{userId}', [GamificationController::class, 'getRewards']);
    });

    // Recommendations
    Route::post('/recommendations', [RecommendationController::class, 'getRecommendations']);

    // Reviews
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::get('/{productId}', [ReviewController::class, 'getReviews']);
    });

    // Coupons
    Route::prefix('coupons')->group(function () {
        Route::post('/apply', [CouponController::class, 'applyCoupon']);
    });
   Route::get('/search', [SearchController::class, 'search'])->name('search');
});

