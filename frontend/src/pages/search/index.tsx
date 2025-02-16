import React from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Configure
} from "react-instantsearch-dom";
import Image from 'next/image';

// Import the CustomHits component
import CustomHits from "@/components/CustomHits";

// Algolia credentials
const searchClient = algoliasearch("YourApplicationID", "YourSearchOnlyAPIKey");

export default function SearchPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Search Our Products</h1>
      
      <InstantSearch
        searchClient={searchClient}
        indexName="YourIndexName"
         insights={true} // Enable event tracking
      >
        {/* Configure the number of results per page */}
        <Configure hitsPerPage={8} />

        {/* Flex container for search bar and Algolia logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <SearchBox />
          
          <Image
            src="/algolia-logos/Algolia Logo Pack 2022/SVG/Algolia-logo-blue.svg"
            alt="Powered by Algolia"
            height={30} // Adjust height as needed
            width={100} // Adjust width as needed
          />
        </div>

        {/* Custom hits component with search results */}
        <CustomHits />
      </InstantSearch>
    </div>
  );
}
