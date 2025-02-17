
// frontend/src/pages/index.tsx

import React from "react";
import Layout from "@/components/Layout/Layout";
import SEO from "@/components/Layout/SEO";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function HomePage() {
  return (
    <>
      {/* SEO for meta tags, title, etc. */}
      <SEO
        title="AdapNow E-Commerce"
        description="Welcome to AdapNow, your one-stop e-commerce solution for premium print products!"
        keywords="ecommerce, printing, business cards, stationery"
      />

      {/* Top-level Header */}
     {/* <Header /> */}

      {/* Optional Navigation Bars */}
     {/* <Navbar />*/}
      {/*/<NavbarCategories />*/}

      {/* Layout that might provide a container or styling */}
      <Layout>
        {/* Example layout with a sidebar + main content */}
        <div className="flex">
          {/* Sidebar for categories or navigation */}
          <aside className="hidden md:block w-64 p-4 bg-gray-50">
            <SidebarMenu />
          </aside>

          {/* Main content area */}
          <main className="flex-grow p-4">
            {/* Hero Banner */}
            <HeroSection />

            {/* Featured Categories */}
            <FeaturedCategories />

            {/* Newsletter Signup */}
            <NewsletterSignup />
          </main>
        </div>
      </Layout>

      {/* Footer at the bottom */}
      <Footer />
    </>
  );
}
