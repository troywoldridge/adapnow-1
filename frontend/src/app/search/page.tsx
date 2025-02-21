"use client";

import React from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Configure,
  Hits,
  Pagination,
  RefinementList,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import Image from "next/image";
import Link from "next/link";

/** 1) Algolia search client */
const searchClient = algoliasearch(
  "12N0JD5MJD",
  "198c6e8c46b1332bc153a07585c84872"
);

/** 2) Custom hit component */
interface ProductHitProps {
  hit: {
    /** Add objectID to make each row clickable */
    objectID: string;
    name: string;
    description?: string;
  };
}

function ProductHit({ hit }: ProductHitProps) {
  return (
    <Link
      href={`/product/${hit.objectID}`}
      className="block p-3 border-b hover:bg-gray-100"
    >
      <h3 className="font-semibold">{hit.name}</h3>
      {hit.description && (
        <p className="text-sm text-gray-600">{hit.description}</p>
      )}
    </Link>
  );
}

/** 3) Main Search Page */
export default function SearchPage() {
  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Search Our Products</h1>

      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure hitsPerPage={8} />

        {/* 4) Search row: input + Algolia logo */}
        <div className="flex items-center gap-4 mb-8">
          <SearchBox
            className="w-full p-2 border rounded text-black placeholder-gray-500 focus:outline-none"
            placeholder="Search products..."
          />
          <Image
            src="/images/Algolia-logo-blue.svg"
            alt="Powered by Algolia"
            width={100}
            height={30}
          />
        </div>

        {/* 5) Conditional rendering: only show results if user typed a query */}
        <ConditionalResults />
      </InstantSearch>
    </div>
  );
}

/**
 * Checks user’s current query via `useSearchBox()`.
 * If empty, display a placeholder message.
 * Otherwise, show refinements, hits, and pagination in a horizontal layout.
 */
function ConditionalResults() {
  const { query } = useSearchBox();

  // If no query typed, show a placeholder message or nothing
  if (!query.trim()) {
    return (
      <p className="text-gray-500">
        Type something above to see categories, brands, and matching products.
      </p>
    );
  }

  // If the user typed a query, show the usual layout
  return (
    <div className="flex gap-8">
      {/* LEFT: refinements (hidden on small screens) */}
      <aside className="w-64 hidden md:block">
        <h2 className="text-lg font-semibold mb-2">Category</h2>
        <RefinementList attribute="category" />

        <h2 className="text-lg font-semibold mt-6 mb-2">Brand</h2>
        <RefinementList attribute="brand" />
      </aside>

      {/* RIGHT: hits & pagination */}
      <main className="flex-1">
        <Hits hitComponent={ProductHit} />

        {/* Horizontal pagination */}
        <Pagination
          className="mt-4"
          classNames={{
            list: "flex flex-wrap items-center gap-2",
            item: "bg-white border rounded px-2 py-1 hover:bg-gray-100",
            link: "text-blue-600",
            disabledItem: "opacity-50 pointer-events-none",
            selectedItem: "bg-blue-500 text-white",
          }}
        />
      </main>
    </div>
  );
}
