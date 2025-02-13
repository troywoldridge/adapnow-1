@extends('layouts.app')

@section('content')
    <h1>Search Results</h1>

    @if ($results->isEmpty())
        <p>No products found.</p>
    @else
        <ul>
            @foreach ($results as $product)
                <li>
                     href="{{ route('products.show', $product->id) }}">{{ $product->name }} - {{ $product->category }}
                </li>
            @endforeach
        </ul>
    @endif
@endsection
