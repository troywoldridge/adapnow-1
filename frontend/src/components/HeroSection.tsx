"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Welcome to AdapNow!",
    text: "Your one-stop shop for premium print products and e-commerce solutions.",
    buttonText: "Shop Now",
    buttonLink: "#featured",
    image: "/images/free-shipping.jpg",
  },
  {
    title: "Quality Print Products",
    text: "Discover premium business cards, flyers, and more.",
    buttonText: "Browse Catalog",
    buttonLink: "/print-products",
    image: "/images/apparel.jpeg",
  },
  {
    title: "Large Format Printing",
    text: "Banners, posters, and more for your business needs.",
    buttonText: "Explore Large Format",
    buttonLink: "/large-format",
    image: "/images/glossy-banners-b.jpg",
  },
  {
    title: "Stationery & Labels",
    text: "Custom stationery and labels for every occasion.",
    buttonText: "View Stationery",
    buttonLink: "/stationery",
    image: "/images/60lb-uncoated-letterhead.jpg",
  },
  {
    title: "Apparel & Merchandise",
    text: "Custom apparel to elevate your brand or event.",
    buttonText: "View Apparel",
    buttonLink: "/apparel",
    image: "/images/apparel-2.jpeg",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-gray-200"
      style={{ height: "150px" }} // Adjust height as needed
    >
      <div className="relative max-w-screen-xl mx-auto px-4 h-[150px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full flex items-center transition-opacity duration-700 ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {/* Text Section (hidden on mobile) */}
            <div className="flex-1 hidden md:flex flex-col justify-center">
              <h1 className="text-lg font-bold">{slide.title}</h1>
              <p className="text-md">{slide.text}</p>
              <Link href={slide.buttonLink}>
                <span className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 cursor-pointer text-xs mt-4 inline-block">
                  {slide.buttonText}
                </span>
              </Link>
            </div>

            {/* Image Section */}
            <div className="flex-1 flex justify-center items-center">
              <Image
                src={slide.image}
                alt={slide.title}
                width={200}
                height={150}
                className="object-contain"
                style={{ maxHeight: "1000px", maxWidth: "200%" }}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
