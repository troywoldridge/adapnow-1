// app/layout.tsx (Server Component by default)

import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import NavbarCategories from '@/components/Layout/NavbarCategories';
import SidebarMenu from '@/components/Layout/SidebarMenu';
import '@/styles/globals.css';

// If you have a special SEO component, see note below. 
// import SEO from '@/components/Layout/SEO';

export const metadata = {
  title: 'My App',
  description: 'A Next.js 13 App Router site',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header / Navbar */}
        <Header />
        <NavbarCategories />
        <SidebarMenu />

        {/* Main content (child routes) */}
        {children}

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
// The constructor function is not needed in this context as it is not a class component.
// If you need to initialize some parameters or state, you can do it inside the RootLayout function or use React hooks.


