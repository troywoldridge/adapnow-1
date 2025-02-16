// components/HeroSection.tsx
import React from "react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-gray-200 py-16">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="flex-1 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Welcome to AdapNow!</h1>
          <p className="text-lg text-gray-700 mb-4">
            Your one-stop shop for premium print products and e-commerce solutions.
          </p>
          <a
            href="#featured"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Shop Now
          </a>
        </div>
        <div className="flex-1">
          <Image src="/hero-banner.png" alt="Hero Banner" width={500} height={300} className="w-full h-auto" />
          <Image src="/hero-banner.png" alt="Hero Banner" width={500} height={300} className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
}
