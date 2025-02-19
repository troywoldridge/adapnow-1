//<?php

//use Illuminate\Support\Facades\Route;
//use Illuminate\Support\Facades\Http;
//use Illuminate\Support\Facades\Redis;
//use App\Http\Controllers\SinaliteController;



// Define the homepage route
//Route::get('/', function () {
  //  return view('welcome');
//});

// Redis test route
//Route::get('/test-redis', function () {
  //  Redis::set('test_key', 'This is a test value');
    //return Redis::get('test_key');
//});

// Dispatch a job to fetch products
//Route::get('/dispatch-fetch-products', [SinaliteController::class, 'dispatchFetchProductsJob']);

// Sinalite API test route
//Route::get('/test-sinalite', function () {
  //  $authUrl = config('services.sinalite.auth_url');
 //   $clientId = config('services.sinalite.client_id');
 //   $clientSecret = config('services.sinalite.client_secret');
 //   $audience = config('services.sinalite.audience');

 //   $response = Http::asForm()->post($authUrl, [
 //       'client_id' => $clientId,
 //       'client_secret' => $clientSecret,
//        'audience' => $audience,
//        'grant_type' => 'client_credentials',
  //  ]);

 //   if ($response->successful()) {
 //       $token = $response->json()['access_token'];
//        return response()->json(['access_token' => $token]);
//    } else {
//        return response()->json(['error' => $response->json()], 500);
//    }
//});
//Route::get('/ping', function () {
//    return response()->json(['status' => 'success', 'message' => 'API is working!']);
//});
