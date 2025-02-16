import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  connectStateResults,
  connectHighlight,
  connectHits,
  Highlight,
  RefinementList,
  connectRefinementList,
} from "react-instantsearch-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaUser, FaShoppingCart, FaTruck } from "react-icons/fa";

// Replace with your own Algolia credentials
const searchClient = algoliasearch("12N0JD5MJD", "198c6e8c46b1332bc153a07585c84872");

// Example: Local Storage key for recent searches
const RECENT_SEARCHES_KEY = "adapnow_recent_searches";

/**
 * Custom "No results" component for error/empty states.
 */
const CustomStateResults = connectStateResults(
  ({ searchResults, searching, error }) => {
    if (error) {
      return (
        <div className="p-4 text-red-500">
          An error occurred: {error.message}
        </div>
      );
    }

    if (searching) {
      return <div className="p-4 text-gray-500">Loading search results...</div>;
    }

    if (!searchResults || searchResults.nbHits === 0) {
      return <div className="p-4 text-gray-700">No results found.</div>;
    }

    return null; // If we have results, render nothing here.
  }
);

/**
 * Custom highlight for hits (for better styling or more control).
 */
const CustomHighlight = connectHighlight(
  ({ highlight, attribute, hit, className }: any) => {
    const parsedHit = highlight({
      highlightProperty: "_highlightResult",
      attribute,
      hit,
    });

    return (
      <span className={className}>
        {parsedHit.map((part: any, index: number) =>
          part.isHighlighted ? (
            <mark key={index} className="bg-yellow-200">
              {part.value}
            </mark>
          ) : (
            <span key={index}>{part.value}</span>
          )
        )}
      </span>
    );
  }
);

/**
 * Custom Hits component to show search suggestions in a dropdown.
 */
const CustomHits = connectHits(({ hits, onSelect }: any) => {
  return (
    <ul className="bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
      {hits.map((hit: any) => (
        <li
          key={hit.objectID}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(hit)}
        >
          {/* Use the custom highlight to show matched terms */}
          <CustomHighlight attribute="name" hit={hit} />
        </li>
      ))}
    </ul>
  );
});

/**
 * Custom refinement list for "filters".
 * Typically you'd put filters on a dedicated search page,
 * but here's an example of how to do it inline.
 */
const CustomRefinementList = connectRefinementList(
  ({ items, refine, attribute }: any) => {
    return (
      <div className="p-2">
        <h4 className="font-bold mb-2">{attribute} Filter</h4>
        {items.map((item: any) => (
          <label key={item.label} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="mr-2"
            />
            <span>
              {item.label} ({item.count})
            </span>
          </label>
        ))}
      </div>
    );
  }
);

const Header: React.FC = () => {
  const router = useRouter();

  // Toggle states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHits, setShowHits] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const hitsContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Load recent searches from localStorage on mount.
   */
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  /**
   * Save recent searches to localStorage whenever they change.
   */
  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  /**
   * Close the hits dropdown if clicked outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        hitsContainerRef.current &&
        !hitsContainerRef.current.contains(event.target as Node)
      ) {
        setShowHits(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Handle toggling the search bar on mobile.
   */
  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  /**
   * When a user selects a hit, let's add it to "recent searches".
   */
  const handleSelectHit = (hit: any) => {
    // You could navigate to a product page here:
    // router.push(`/products/${hit.slug}`);

    // For now, just store the name as a recent search.
    const newSearches = [hit.name, ...recentSearches.filter((s) => s !== hit.name)];
    // Limit to 5 recent searches
    setRecentSearches(newSearches.slice(0, 5));
    setShowHits(false);
  };

  /**
   * Clear the current search input
   */
  const handleClearSearch = () => {
    setSearchQuery("");
    setShowHits(false);
  };

  /**
   * For analytics or user feedback,
   * we can track each search query here.
   */
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      // Navigate to a /search page with the query, for example
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);

      // Update recent searches
      const newSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ];
      setRecentSearches(newSearches.slice(0, 5));
      setShowHits(false);
    }
  };

  return (
    <header className="bg-white shadow-md relative">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl font-bold cursor-pointer text-blue-600">
              AdapNow
            </span>
          </Link>
        </div>

        {/* Desktop Search (Algolia + custom suggestions) */}
        <div className="hidden md:flex flex-1 justify-center mx-4 relative">
          <InstantSearch
            searchClient={searchClient}
            indexName="your_index_name"
            onSearchStateChange={({ query }) => {
              // Update local state for the search box
              setSearchQuery(query || "");
              setShowHits(Boolean(query));
            }}
          >
            {/* Configure sets hitsPerPage or any default filters */}
            <Configure hitsPerPage={5} />

            {/* We can also show a refinement list for a "category" attribute */}
            {/* <CustomRefinementList attribute="category" /> */}

            {/* The search box with a custom onSubmit handler */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
              <SearchBox
                translations={{
                  placeholder: "Search products...",
                }}
                submit={<></>} // remove default button
                reset={<></>}  // remove default reset
              />
              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Hits dropdown + Loading/Empty states */}
            <div
              className={`absolute top-full mt-2 w-full max-w-lg z-50 ${
                showHits ? "block" : "hidden"
              }`}
              ref={hitsContainerRef}
            >
              <CustomStateResults />
              <CustomHits onSelect={handleSelectHit} />
            </div>
          </InstantSearch>
        </div>

        {/* Icons: Socials, Account, Cart, Tracking */}
        <div className="flex items-center space-x-4">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="text-gray-600 hover:text-blue-600" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-gray-600 hover:text-blue-600" />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-gray-600 hover:text-pink-600" />
          </a>

          {/* Account */}
          <Link href="/account">
            <FaUser className="text-gray-600 hover:text-blue-600 cursor-pointer" />
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <FaShoppingCart className="text-gray-600 hover:text-blue-600 cursor-pointer" />
          </Link>

          {/* Tracking */}
          <Link href="/tracking">
            <FaTruck className="text-gray-600 hover:text-blue-600 cursor-pointer" />
          </Link>

          {/* Mobile search toggle */}
          <button className="md:hidden" onClick={handleSearchToggle}>
            <svg
              className="h-5 w-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 21l6-6m0 0l-6-6m6 6H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="md:hidden bg-white px-4 pb-2">
          <InstantSearch
            searchClient={searchClient}
            indexName="your_index_name"
            onSearchStateChange={({ query }) => {
              setSearchQuery(query || "");
              setShowHits(Boolean(query));
            }}
          >
            <Configure hitsPerPage={5} />
            <form onSubmit={handleSearchSubmit} className="relative">
              <SearchBox
                translations={{
                  placeholder: "Search products...",
                }}
                submit={<></>}
                reset={<></>}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Hits + Loading/Empty states */}
            <div
              className={`relative w-full max-w-lg z-50 ${
                showHits ? "block" : "hidden"
              }`}
              ref={hitsContainerRef}
            >
              <CustomStateResults />
              <CustomHits onSelect={handleSelectHit} />
            </div>
          </InstantSearch>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-2">
              <h4 className="font-bold mb-1">Recent Searches</h4>
              <ul className="space-y-1">
                {recentSearches.map((search, idx) => (
                  <li
                    key={idx}
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => {
                      setSearchQuery(search);
                      setShowHits(false);
                      router.push(`/search?query=${encodeURIComponent(search)}`);
                    }}
                  >
                    {search}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* You could optionally place a custom <NavbarCategories /> here */}
    </header>
  );
};

export default Header;
