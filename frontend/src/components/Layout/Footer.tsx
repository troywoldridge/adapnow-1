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
                <Link href="/about">
                  <span className="hover:text-white cursor-pointer">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-white cursor-pointer">
                    Contact
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/faqs">
                  <span className="hover:text-white cursor-pointer">
                    FAQs
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <span className="hover:text-white cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <span className="hover:text-white cursor-pointer">
                    Terms of Service
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-white mb-2">Customer Service</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/shipping">
                  <span className="hover:text-white cursor-pointer">
                    Shipping &amp; Returns
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <span className="hover:text-white cursor-pointer">
                    Support Center
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/order-tracking">
                  <span className="hover:text-white cursor-pointer">
                    Order Tracking
                  </span>
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
// This code defines a Footer component for an e-commerce website using React and Tailwind CSS.
// The footer includes sections for "About AdapNow," "Quick Links," "Customer Service," and a newsletter subscription form.
// Each section contains relevant links and information.
// The footer is styled with a dark background and light text, and it is responsive for different screen sizes.
// The component is exported for use in other parts of the application.
// The footer also includes a copyright notice that dynamically displays the current year.
// The component is designed to be reusable and can be easily integrated into a larger layout.
// The footer is designed to be visually appealing and user-friendly, providing essential information and links to enhance the user experience.