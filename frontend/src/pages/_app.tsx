// pages/_app.tsx
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import "../styles/globals.css";


// Optional: Example theme or state providers
// import { ThemeProvider } from "styled-components";
// import { Provider as ReduxProvider } from "react-redux";
// import store from "@/store/store";

// Layout wraps your pages with Header, Footer, etc.
import Layout from "@/components/Layout/Layout";

// Optional: Analytics or logging
// e.g., Google Analytics
function useAnalytics() {
  useEffect(() => {
    // Example: a custom analytics script or Google Analytics
    console.log("Analytics loaded");
  }, []);
}

function MyErrorBoundary({ children }: { children: React.ReactNode }) {
  // In a real scenario, you'd use a library like react-error-boundary
  // or create your own class component error boundary.
  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  // If you want analytics on every page load
  useAnalytics();

  return (
    // <ThemeProvider theme={myTheme}>
    // <ReduxProvider store={store}>
    <MyErrorBoundary>
      {/* 
        Layout: 
          - Could handle site-wide Header, Footer
          - Could wrap pages in a main container
      */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MyErrorBoundary>
    // </ReduxProvider>
    // </ThemeProvider>
  );
}

export default MyApp;
// This code sets up a Next.js application with a custom App component.
// It imports necessary modules and styles, including global CSS.
// It defines a custom MyApp component that wraps each page with a layout component.
// The layout can include site-wide elements like a header and footer.
// The code also includes optional analytics tracking and error boundary handling.
// The useAnalytics function is a placeholder for loading analytics scripts.
// The MyErrorBoundary component is a placeholder for error handling.
// The MyApp component is exported as the default export, which Next.js uses to render the application.
// The code is structured to allow for easy integration of theming, state management, and error handling.