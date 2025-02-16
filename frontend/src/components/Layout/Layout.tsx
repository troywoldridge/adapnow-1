import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import NavbarCategories from "@/components/Navbar/NavbarCategories";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import SEO from "@/components/Layout/SEO";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <>
      {/* Use the SEO component with props */}
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

      {/* Wrapper for Header, Content, and Footer */}
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <header>
          {/* Main Navigation */}
          <Navbar />
          {/* Dropdown Categories Navigation */}
          <NavbarCategories />
        </header>

        {/* Main Content Area */}
        <div className="flex-grow">
          <div className="flex">
            {/* Sidebar for Filters or Subcategories */}
            <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 bg-white shadow-md p-4">
              <SidebarMenu />
            </aside>

            {/* Content Section */}
            <main className="flex-grow bg-white p-6 md:p-8 lg:p-10">
              {children}
            </main>
          </div>
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
