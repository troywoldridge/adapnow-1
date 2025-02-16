import React from "react";
import Link from "next/link";

/**
 * Simple array of main product categories.
 * Each category has a label and a link to a landing page.
 */
const categories = [
  { label: "Business Cards", href: "/categories/business-cards" },
  { label: "Print Products", href: "/categories/print-products" },
  { label: "Large Format", href: "/categories/large-format" },
  { label: "Stationary", href: "/categories/stationary" },
  { label: "Labels & Packaging", href: "/categories/labels-and-packaging" },
  { label: "Apparel", href: "/categories/apparel" },
  { label: "Gifts", href: "/categories/gifts" },
];

const SidebarMenu: React.FC = () => {
  return (
    <nav className="flex flex-col space-y-2">
      {categories.map((cat, index) => (
        <Link key={index} href={cat.href}>
          {/* You can style this button any way you like */}
          <button
            type="button"
            className="w-full text-left bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {cat.label}
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default SidebarMenu;
