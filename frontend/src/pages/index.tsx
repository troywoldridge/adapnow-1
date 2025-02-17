import React from "react";
import Layout from "@/components/Layout/Layout";
import SEO from "@/components/Layout/SEO";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function HomePage() {
  return (
    <>
      <SEO
        title="AdapNow E-Commerce"
        description="Welcome to AdapNow, your one-stop e-commerce solution for premium print products!"
        keywords="ecommerce, printing, business cards, stationery"
      />

      {/* The Layout component already includes the header, sidebar (SidebarMenu), and footer */}
      <Layout>
        {/* Main content area: These children will be rendered within the main section of Layout */}
        <HeroSection />
        <FeaturedCategories />
        <NewsletterSignup />
      </Layout>
    </>
  );
}
