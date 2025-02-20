import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <HeroSection />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
}

