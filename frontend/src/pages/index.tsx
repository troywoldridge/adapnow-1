import React from "react";
import Layout from "@/components/Layout/Layout";
import SEO from "@/components/Layout/SEO";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewsletterSignup from "@/components/NewsletterSignup";

// If you have these components, uncomment and use them:
import Header from "@/components/Header/Header";
import NavbarCategories from "@/components/Navbar/NavbarCategories";
// import Footer from "@/components/Layout/Footer";

export default function HomePage() {
  return (
    <>
      {/* SEO for meta tags, title, etc. */}
      <SEO
        title="AdapNow E-Commerce"
        description="Welcome to AdapNow, your one-stop e-commerce solution for premium print products!"
        keywords="ecommerce, printing, business cards, stationery"
      />

      {/* Wrap everything in Layout if it provides global structure */}
      <Layout>
        {/* 
          1) Single Header (top bar with brand, search, user icons) 
             If your Layout does NOT already include a header, use <Header /> here.
        */}
        <Header />

        {/* 
          2) Single Navbar for categories (below the header). 
             If your Layout does NOT already include a navbar, use <NavbarCategories /> here.
        */}
        <NavbarCategories />

        {/* 3) Main layout: sidebar + main content in a flex container */}
        <div className="container mx-auto flex gap-4 px-4 py-4">
          {/* Sidebar on the left */}
          <aside className="hidden md:block w-64 bg-white border border-gray-200 p-4">
            <SidebarMenu />
          </aside>

          {/* Main content area */}
          <main className="flex-grow bg-white border border-gray-200 p-4">
            <HeroSection />
            <FeaturedCategories />
            <NewsletterSignup />
          </main>
        </div>

        {/* 4) Single Footer (if you have one) */}
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
