// frontend/src/components/FeaturedCategories.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { label: "Business Cards", href: "/categories/business-cards", img: "/images/bc.jpg" },
  { label: "Large Format", href: "/categories/large-format", img: "/images/large-format.jpg" },
  { label: "Stationary", href: "/categories/stationary", img: "/images/stationary.jpg" },
  { label: "Apparel", href: "/categories/apparel", img: "/images/apparel.jpg" },
];

export default function FeaturedCategories() {
  return (
    <section className="py-10" id="categories">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href}>
              <div className="border rounded overflow-hidden hover:shadow-md transition-shadow">
                <Image
                  src={cat.img}
                  alt={cat.label}
                  width={500}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{cat.label}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
