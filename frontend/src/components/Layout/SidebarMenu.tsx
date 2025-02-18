import React from "react";
import Link from "next/link";

const categories = [
  { label: "Business Cards", href: "/categories/business-cards" },
  { label: "Print Products", href: "/categories/print-products" },
  { label: "Large Format", href: "/categories/large-format" },
  { label: "Stationery", href: "/categories/stationery" },
  { label: "Labels & Packaging", href: "/categories/labels-and-packaging" },
  { label: "Apparel", href: "/categories/apparel" },
  { label: "Gifts", href: "/categories/gifts" },
];

const SidebarMenu: React.FC = () => {
  return (
    <div className="w-full lg:w-64">
      <nav className="flex flex-col space-y-4">
        {categories.map((cat, index) => (
          <Link key={index} href={cat.href}>
            <button
              className="
                w-full text-left 
                bg-gradient-to-r from-blue-600 to-purple-600 
                text-white font-semibold p-3 rounded 
                hover:from-blue-700 hover:to-purple-700 
                transition-colors
              "
            >
              {cat.label}
            </button>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SidebarMenu;
