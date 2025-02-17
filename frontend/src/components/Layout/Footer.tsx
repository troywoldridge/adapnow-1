// components/Layout/Footer.tsx
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 pt-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-white mb-2">About AdapNow</h3>
            <p className="text-sm">
              AdapNow is your go-to e-commerce platform for high-quality print
              products. From business cards to banners, we offer fast shipping
              and unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-white mb-2">Customer Service</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-white">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="font-bold text-white mb-2">Stay Connected</h3>
            <p className="text-sm">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-md w-full px-2 py-1 text-black"
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AdapNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

