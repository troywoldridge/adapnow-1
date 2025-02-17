/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import NavbarCategories from "@/components/Navbar/NavbarCategories";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import SEO from "@/components/Layout/SEO";
import Footer from "@/components/Footer/Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <>
      {/* Dynamic SEO for each page */}
      <SEO
        title={title || "AdapNow E-Commerce"}
        description={
          description ||
          "Explore AdapNow's extensive collection of high-quality print products. Enhance your brand with custom prints, fast shipping, and affordable pricing."
        }
        keywords="e-commerce, print products, business cards, postcards, banners, AdapNow"
        author="AdapNow"
        canonicalUrl="https://www.adapnow.com"
        ogTitle="AdapNow E-Commerce"
        ogDescription="Your go-to destination for top-quality print products. Explore our range of business cards, postcards, and more."
        ogImage="/og-image.jpg"
        ogUrl="https://www.adapnow.com"
        twitterCard="summary_large_image"
      />

      {/* Full-page container for layout */}
      <div className="flex flex-col min-h-screen">

        {/* Header Section with Blue->Purple Gradient */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md transition-colors duration-300 hover:from-blue-700 hover:to-purple-700">
          {/* Center container for navbar items */}
          <div className="max-w-screen-xl mx-auto">
            <Navbar />
            <NavbarCategories />
          </div>
        </header>

        {/* Main Content Area (pushes footer to bottom) */}
        <div className="flex-grow">
          <div className="flex max-w-screen-xl mx-auto w-full">
            {/* Sidebar on large screens */}
            <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 bg-white shadow-md p-4">
              <SidebarMenu />
            </aside>

            {/* Main Page Content */}
            <main className="flex-grow bg-white p-6 md:p-8 lg:p-10">
              {children}
            </main>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-8 bg-gray-900 text-white">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Layout;

// Add CSS for fade-in animations
// Add this to your global CSS file (e.g., styles/globals.css)
// @tailwind base;
// @tailwind components;
// @tailwind utilities;
//
// @layer utilities {
//   @keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     100% {
      opacity: 1;
//     }
//   }
//
//   .animate-fadeIn {
//     animation: fadeIn 0.5s ease-in-out;
//   }
//
//   .animate-fadeInLeft {
//     animation: fadeIn 0.5s ease-in-out;
//     animation-delay: 0.2s;     