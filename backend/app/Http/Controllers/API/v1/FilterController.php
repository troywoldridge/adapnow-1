<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class FilterController extends Controller
{
    /**
     * Get all filters dynamically from the database.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $filters = Filter::all();
        return response()->json($filters);
    }
}
