/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Configure,
  connectStateResults,
  connectHits,
  connectHighlight,
} from "react-instantsearch-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaUser, FaShoppingCart, FaTruck } from "react-icons/fa";

// Algolia Credentials
const searchClient = algoliasearch("YourApplicationID", "YourSearchOnlyAPIKey");

// Local Storage key for recent searches
const RECENT_SEARCHES_KEY = "adapnow_recent_searches";

export default function Header() {
  const router = useRouter(); // ✅ Correctly inside the function component
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from local storage
    const storedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    setRecentSearches(storedSearches);
  }, []);

  /**
   * Handle search submission (redirects to search page)
   */
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = event.currentTarget.search.value;

    // Store recent searches
    const updatedSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));

    router.push(`/search?q=${query}`);
  };

  /**
   * Custom highlight for search results
   */
  const CustomHighlight = connectHighlight(({ highlight, attribute, hit, className }: any) => {
    const parsedHit = highlight({
      highlightProperty: "_highlightResult",
      attribute,
      hit,
    });

    return (
      <span className={className}>
        {parsedHit.map((part: any, index: number) =>
          part.isHighlighted ? (
            <mark key={index} className="bg-yellow-200">{part.value}</mark>
          ) : (
            <span key={index}>{part.value}</span>
          )
        )}
      </span>
    );
  });

  /**
   * Custom Hits component for search results
   */
  const CustomHits = connectHits(({ hits }: { hits: any[] }) => (
    <ul className="bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
      {hits.map((hit) => (
        <li key={hit.objectID} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <CustomHighlight attribute="name" hit={hit} />
        </li>
      ))}
    </ul>
  ));

  /**
   * Custom "No results" message
   */
  const CustomStateResults = connectStateResults(({ searchResults, searching }: any) => {
    if (searching) return <div className="p-4 text-gray-500">Loading search results...</div>;
    if (!searchResults || searchResults.nbHits === 0) return <div className="p-4 text-gray-700">No results found.</div>;
    return null;
  });

  return (
    <header className="bg-gray-100 p-4 shadow-md">
      {/* Top bar with social links and user/cart */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900"><FaFacebookF /></a>
          <a href="#" className="text-gray-600 hover:text-gray-900"><FaTwitter /></a>
          <a href="#" className="text-gray-600 hover:text-gray-900"><FaInstagram /></a>
        </div>
        <div className="flex space-x-4">
          <Link href="/account"><FaUser className="text-gray-600 hover:text-gray-900" /></Link>
          <Link href="/cart"><FaShoppingCart className="text-gray-600 hover:text-gray-900" /></Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex items-center space-x-4">
        <InstantSearch searchClient={searchClient} indexName="YourIndexName">
          <Configure hitsPerPage={5} />

          <form onSubmit={handleSearchSubmit} className="flex-1">
            <SearchBox />
          </form>

          <CustomHits />
          <CustomStateResults />
        </InstantSearch>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-bold">Recent:</span>{" "}
          {recentSearches.map((search, index) => (
            <button key={index} className="underline mx-1" onClick={() => router.push(`/search?q=${search}`)}>
              {search}
            </button>
          ))}
        </div>
      )}

      {/* Shipping Info */}
      <div className="mt-2 flex items-center text-gray-700">
        <FaTruck className="mr-2" />
        <span>Free shipping on orders over $50!</span>
      </div>
    </header>
  );
}
