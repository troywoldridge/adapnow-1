// frontend/src/components/NewsletterSignup.tsx
import React from "react";

export default function NewsletterSignup() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-gray-700 mb-6">Subscribe to our newsletter for updates and special offers!</p>
        <form className="inline-block">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-3 py-2 border border-gray-300 rounded-l"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
