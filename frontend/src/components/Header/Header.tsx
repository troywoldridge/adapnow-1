import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox } from "react-instantsearch";
import { Highlight } from "react-instantsearch-hooks-web";
import { Configure, useHits } from "react-instantsearch-hooks-web";
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
    return (
      <ul className="bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
        {hits.map((hit) => (
          <li key={hit.objectID} className="p-2 border-b border-gray-100">
            <Link href={`/product/${hit.objectID}`}>
              <a>
                <CustomHighlight hit={hit} attribute="name" />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/">
        <a className="text-xl font-bold">AdapNow</a>
      </Link>
      
      <InstantSearch searchClient={searchClient} indexName="your_index_name">
        <Configure hitsPerPage={5} />
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchBox
            className="p-2 rounded border"
            placeholder="Search..."
          />
          <style jsx>{`
            .ais-SearchBox-submit {
              display: none;
            }
          `}</style>
          <CustomHits />
        </form>
      </InstantSearch>
      
      <nav className="flex gap-4">
        <a href="#" aria-label="Facebook">
          <FaFacebookF />
        </a>
        <a href="#" aria-label="Twitter">
          <FaTwitter />
        </a>
        <a href="#" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="#" aria-label="User Account">
          <FaUser />
        </a>
        <a href="#" aria-label="Shopping Cart">
          <FaShoppingCart />
        </a>
        <a href="#" aria-label="Shipping Information">
          <FaTruck />
        </a>
      </nav>
    </header>
  );
}
