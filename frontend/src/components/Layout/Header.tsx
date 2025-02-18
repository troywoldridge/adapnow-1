import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Configure, useHits } from "react-instantsearch";
import { Highlight } from "react-instantsearch";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaUser,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";

// Algolia Credentials
const searchClient = algoliasearch("12N0JD5MJD", "198c6e8c46b1332bc153a07585c84872");

// Local Storage key for recent searches
const RECENT_SEARCHES_KEY = "adapnow_recent_searches";

export default function Header() {
  const router = useRouter();

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  useEffect(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = event.currentTarget.search.value.trim();

    // Update recent searches
    const updatedSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));

    router.push(`/search?q=${query}`);
  };

  // Custom highlight for search results
  const CustomHighlight = ({
    hit,
    attribute,
  }: {
    hit: { objectID: string; name?: string; __position: number };
    attribute: string;
  }) => {
    return (
      <Highlight
        hit={hit}
        attribute={attribute as keyof typeof hit}
        classNames={{
          highlighted: "bg-yellow-200",
        }}
      />
    );
  };

  // CustomHits to display search suggestions
  const CustomHits = () => {
    const { hits } = useHits();
    if (!hits.length) return null; // Hide dropdown if no results

    return (
      <ul className="bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto absolute w-full z-50 mt-1">
        {hits.map((hit) => (
          <li key={hit.objectID} className="p-2 border-b border-gray-100 hover:bg-gray-100">
            <Link href={`/product/${hit.objectID}`}>
              <span>
                <CustomHighlight hit={hit} attribute="name" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  // Dropdown control
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !document.getElementById("search-container")?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="
        w-full bg-gradient-to-r from-blue-600 to-purple-600 
        text-white font-semibold p-2 flex items-center
        hover:from-blue-700 hover:to-purple-700 transition-colors
      "
    >
      {/* LOGO / BRAND */}
      <Link href="/">
        <span className="text-xl font-bold cursor-pointer ml-2">AdapNow</span>
      </Link>

      {/* SEARCH SECTION */}
      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure hitsPerPage={5} />
        {/* Center the search bar and make it bigger */}
        <div id="search-container" className="relative flex-1 flex justify-center mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
            <SearchBox
              className="
                w-full p-2 rounded text-black
                focus:outline-none 
                placeholder-gray-600
              "
              placeholder="Search..."
              onFocus={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && <CustomHits />}
          </form>
        </div>
      </InstantSearch>

      {/* ICONS / NAV */}
      <nav className="flex items-center gap-3 text-lg mr-2">
        <Link href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className="cursor-pointer hover:text-gray-200" />
        </Link>
        <Link href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="cursor-pointer hover:text-gray-200" />
        </Link>
        <Link href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="cursor-pointer hover:text-gray-200" />
        </Link>
        <Link href="/user-account" aria-label="User Account">
          <FaUser className="cursor-pointer hover:text-gray-200" />
        </Link>
        <Link href="/cart" aria-label="Shopping Cart">
          <FaShoppingCart className="cursor-pointer hover:text-gray-200" />
        </Link>
        <Link href="/shipping-info" aria-label="Shipping Information">
          <FaTruck className="cursor-pointer hover:text-gray-200" />
        </Link>
      </nav>
    </header>
  );
}
