<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query', '');  // Get the search query from the request
        $results = Product::search($query)->get();  // Perform the search
        
        return view('search.results', compact('results'));  // Return the results to a view
    }
}
