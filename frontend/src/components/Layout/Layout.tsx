import React from "react";
import Header from "@/components/Layout/Header";
import NavbarCategories from "@/components/Layout/NavbarCategories";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import Footer from "@/components/Layout/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* HEADER */}
      <Header />

      {/* NAVBAR */}
      <NavbarCategories />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-grow w-full px-6 py-6">
        {/* SIDEBAR (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/4 pr-6">
          <SidebarMenu />
        </div>

        {/* MAIN CONTENT AREA without box styling */}
        <main className="flex-grow">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Layout;

