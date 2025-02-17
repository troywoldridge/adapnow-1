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
    <div className="flex flex-col min-h-screen">
      {/* HEADER (top bar) */}
      <Header />

      {/* NAVBAR (horizontal categories below header) */}
      <NavbarCategories />

      {/* MAIN CONTENT WRAPPER (sidebar + main area) */}
      <div className="flex flex-grow max-w-screen-xl mx-auto w-full">
        {/* SIDEBAR (visible on large screens) */}
        <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 bg-white shadow p-4">
          <SidebarMenu />
        </aside>

        {/* MAIN CONTENT (the rest of the space) */}
        <main className="flex-grow bg-white p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Layout;
