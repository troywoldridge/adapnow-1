// app/layout.tsx

import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import NavbarCategories from "@/components/Layout/NavbarCategories";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import "@/styles/globals.css"; // Tailwind or other global CSS

export const metadata = {
  title: "AMerican Design And Printing",
  description: "Your one-stop shop for premium print products and e-commerce solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Top Header + Nav */}
        <Header />
        <NavbarCategories />

        
        {/* Layout: Sidebar on the left, main content on the right */}
        <div className="flex">
          <SidebarMenu />
          <main className="flex-1">{children}</main>
        </div>

        {/* Footer at bottom */}
        <Footer />
      </body>
    </html>
  );
}



