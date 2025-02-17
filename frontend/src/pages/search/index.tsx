import React from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch-dom";
import Image from 'next/image';
import { useRef, useEffect, useState } from "react";


// Import the CustomHits component
import { CustomHits } from "@/components/CustomHits/CustomHits";

// Algolia credentials
const searchClient = algoliasearch("12N0JD5MJD", "198c6e8c46b1332bc153a07585c84872");

// Initialize the 'products' index
const index = searchClient.initIndex('products');

// Perform a search to see if the index exists and contains data
index
  .search('')
  .then(({ hits }) => {
    // If data exists in the index, it will be logged here
    console.log('Index exists and data:', hits);
  })
  .catch((err) => {
    // If there is an error, such as the index not existing, it will be logged here
    console.error('Index does not exist or error:', err);
  });

export default function SearchPage() {
  const searchRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div ref={searchRef} style={{ padding: 20 }}>
      <h1>Search Our Products</h1>
      
      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure hitsPerPage={8} />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <SearchBox onFocus={() => setIsDropdownOpen(true)} />
          <Image src="/algolia-logo.svg" alt="Powered by Algolia" height={30} width={100} />
        </div>
        {isDropdownOpen && <CustomHits />}
      </InstantSearch>
    </div>
  );
}
