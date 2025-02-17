// components/Layout/SidebarMenu.tsx
import React from "react";
import Link from "next/link";

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
    <nav className="flex flex-col space-y-1">
      {categories.map((cat, index) => (
      <Link key={index} href={cat.href}>
        <div className="block w-full text-gray-800 p-2 rounded hover:bg-gray-100 transition-colors">
        {cat.label}
        </div>
      </Link>
      ))}
    </nav>
  );
};

export default SidebarMenu;
