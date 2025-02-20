// frontend/src/components/FeaturedCategories.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    label: "Business Cards",
    href: "/categories/business-cards",
    img: "/images/spot-uv-pc-2.png",  // Updated
  },
  {
    label: "Large Format",
    href: "/categories/large-format",
    img: "/images/glossy-banners-b.jpg",  // Updated
  },
  {
    label: "Stationery",
    href: "/categories/stationery",
    img: "/images/60lb-uncoated-letterhead.jpg",  // Updated
  },
  {
    label: "Apparel",
    href: "/categories/apparel",
    img: "/images/apparel.jpeg",  // Updated
  },
];

export default function FeaturedCategories() {
  return (
    <section className="w-full bg-gray-100 py-10" id="categories">
      <div className="w-full px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Featured Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href}>
              <div className="border rounded-xl overflow-hidden shadow-xl hover:shadow-md transition-shadow bg-white">
                <Image
                  src={cat.img}
                  alt={cat.label}
                  width={500}
                  height={192}
                  // Keep a consistent height, but show the top of the image
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-4 text-center">
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
