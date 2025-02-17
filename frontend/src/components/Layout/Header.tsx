import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox } from "react-instantsearch";
import { Highlight } from "react-instantsearch";
import { Configure, useHits } from "react-instantsearch";
import { FaFacebookF, FaTwitter, FaInstagram, FaUser, FaShoppingCart, FaTruck } from "react-icons/fa";

// Algolia Credentials
const searchClient = algoliasearch("12N0JD5MJD", "198c6e8c46b1332bc153a07585c84872");

// Local Storage key for recent searches
const RECENT_SEARCHES_KEY = "adapnow_recent_searches";

export default function Header() {


  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from local storage
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
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
   * Custom Highlight component for search results
   */
  const CustomHighlight = ({ hit, attribute }: { hit: { objectID: string; name?: string; __position: number }; attribute: string }) => {
    return (
      <Highlight hit={hit} attribute={attribute as keyof typeof hit} classNames={{
        highlighted: 'bg-yellow-200'
      }} />
    );
  };

  /**
   * Custom Hits component for search results
   */
  const CustomHits = () => {
    const { hits } = useHits();
    if (!hits.length) return null; // Hide dropdown if there are no results
  
    return (
      <ul className="bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto absolute w-full z-50">
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
  


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !document.getElementById('search-container')?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/">
        <span className="text-xl font-bold">AdapNow</span>
      </Link>
      
      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure hitsPerPage={5} />
        <div id="search-container">
  <form onSubmit={handleSearchSubmit} className="relative">
    <SearchBox
      className="p-2 rounded border"
      placeholder="Search..."
      onFocus={() => setIsDropdownOpen(true)}
    />
    {isDropdownOpen && <CustomHits />}
  </form>
</div>

      </InstantSearch>
      
      <nav className="flex gap-4">
  <Link href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
    <span><FaFacebookF /></span>
  </Link>
  <Link href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
    <span><FaTwitter /></span>
  </Link>
  <Link href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
    <span><FaInstagram /></span>
  </Link>
  <Link href="/user-account" aria-label="User Account">
    <span><FaUser /></span>
  </Link>
  <Link href="/cart" aria-label="Shopping Cart">
    <span><FaShoppingCart /></span>
  </Link>
  <Link href="/shipping-info" aria-label="Shipping Information">
    <span><FaTruck /></span>
  </Link>
</nav>

    </header>
  );
}
