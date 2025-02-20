"use client";

import React, { useRef, useEffect, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Configure,
  RefinementList,
  Hits,
  Pagination,
} from "react-instantsearch-dom";
import Image from "next/image";
import { CustomHits } from "@/components/CustomHits/CustomHits";

// Your Algolia credentials
const searchClient = algoliasearch("12N0JD5MJD", "198c6e8c46b1332bc153a07585c84872");

// Optional: check index existence
const index = searchClient.initIndex("products");
index
  .search("")
  .then(({ hits }) => {
    console.log("Index exists and data:", hits);
  })
  .catch((err) => {
    console.error("Index does not exist or error:", err);
  });

// Example product hit component
interface ProductHitProps {
  hit: {
    name: string;
    description: string;
  };
}

function ProductHit({ hit }: ProductHitProps) {
  return (
    <div className="p-3 border-b">
      <h3 className="font-semibold">{hit.name}</h3>
      <p className="text-sm text-gray-600">{hit.description}</p>
    </div>
  );
}

export default function SearchPage() {
  const searchRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto" ref={searchRef}>
      <h1 className="text-2xl font-bold mb-4">Search Our Products</h1>

      <InstantSearch searchClient={searchClient} indexName="products">
        {/* Configure results per page, etc. */}
        <Configure hitsPerPage={8} />

        {/* Center & enlarge the search bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <SearchBox
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full p-2 border rounded text-black placeholder-gray-500 focus:outline-none"
              translations={{ placeholder: "Search products..." }}
            />
          </div>
          <Image src="/algolia-logo.svg" alt="Powered by Algolia" height={30} width={100} />
        </div>

        {/* If using CustomHits, show it only when dropdown is open */}
        {isDropdownOpen && <CustomHits />}

        <div className="flex gap-8">
          {/* Left column: refinement checkboxes (like Amazon) */}
          <aside className="w-64 hidden md:block">
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <RefinementList attribute="category" />

            <h2 className="text-lg font-semibold mb-2 mt-4">Brand</h2>
            <RefinementList attribute="brand" />

            {/* Add more refinements, e.g. price range, etc. */}
          </aside>

          {/* Right column: main search results */}
          <main className="flex-1">
            <Hits hitComponent={ProductHit} />

            <div className="mt-4">
              <Pagination />
            </div>
          </main>
        </div>
      </InstantSearch>
    </div>
  );
}
