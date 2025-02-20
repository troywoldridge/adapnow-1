// app/someServerComponent.tsx
// This file is a Server Component by default because it does NOT have "use client" at the top.

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the HeroCarousel Client Component.
// { ssr: false } ensures it only renders on the client, not the server.
const HeroCarousel = dynamic(() => import("@/components/HeroSection"), {
  ssr: false,
});

export default function SomeServerComponent() {
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Welcome to the server component!</h1>
      {/* Renders the HeroCarousel client-side */}
      <HeroCarousel />
    </main>
  );
}
// This is a server component, so you can fetch data directly here if needed.
// import { execute } from "@/lib/db";
//