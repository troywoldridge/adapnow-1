// pages/products/[id].tsx
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import mysql from "mysql2/promise";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface OptionGroup {
  group: string;
  options: string[];
}

interface Pricing {
  base_price: number;
  discount: number;
  final_price: number;
}

interface ProductPageProps {
  product: Product;
  optionGroups: OptionGroup[];
  pricing: Pricing;
}

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  optionGroups,
  pricing,
}) => {
  // Tab state for Details / File Prep / Reviews
  const [activeTab, setActiveTab] = useState("details");

  // State for selected options (by group)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  // Calculated price (simulate dynamic pricing)
  const [calculatedPrice, setCalculatedPrice] = useState(pricing.final_price);

  // When options change, update the price.
  useEffect(() => {
    // Example calculation: start with base price and add $5 for every selected option.
    let newPrice = pricing.base_price;
    Object.values(selectedOptions).forEach((option) => {
      if (option) newPrice += 5;
    });
    setCalculatedPrice(newPrice);
  }, [selectedOptions, pricing.base_price]);

  const handleOptionChange = (group: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [group]: option,
    }));
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      {/* Navigation Link using Next.js Link */}
      <div className="mb-4">
        <Link href="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Product Image, Description, and Tabs */}
        <div className="flex-1">
          {/* Top Section: Image & Description */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-1/2">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover rounded"
              />
            </div>
            {/* Product Description */}
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-xl font-semibold mb-2">
                Price: ${calculatedPrice.toFixed(2)}
              </p>
              {/* You could add an "Add to Cart" button here */}
            </div>
          </div>
          {/* Tabbed Section */}
          <div className="mt-8">
            <div className="border-b mb-4">
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-600 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("fileprep")}
                  className={`pb-2 ${
                    activeTab === "fileprep"
                      ? "border-b-2 border-blue-600 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  File Prep
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2 ${
                    activeTab === "reviews"
                      ? "border-b-2 border-blue-600 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  Reviews
                </button>
              </nav>
            </div>
            <div>
              {activeTab === "details" && (
                <div>
                  <p className="text-gray-700">
                    Detailed features and specifications of the product.
                  </p>
                </div>
              )}
              {activeTab === "fileprep" && (
                <div>
                  <p className="text-gray-700">
                    File preparation instructions: Ensure high-resolution images and correct bleed settings.
                  </p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                  <p className="text-gray-700">Customer Reviews: ★★★★☆ (4.5/5)</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right Column: Options Box */}
        <div className="w-full md:w-1/3">
          <div className="bg-white shadow rounded p-6">
            <h3 className="text-xl font-bold mb-4">Customize Options</h3>
            {optionGroups.map((group) => (
              <div key={group.group} className="mb-4">
                <label className="block font-semibold mb-1">{group.group}</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleOptionChange(group.group, e.target.value)}
                  value={selectedOptions[group.group] || ""}
                >
                  <option value="">Select an option</option>
                  {group.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <p className="mt-4 text-xl font-semibold">
              Total Price: ${calculatedPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Create a connection using environment variables
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,      // e.g., 'localhost'
    user: process.env.DB_USER,      // e.g., 'root'
    password: process.env.DB_PASS,  // your password
    database: process.env.DB_NAME,  // your database name
  });

  // Get the product id from the query string
  const productId = context.query.id ? Number(context.query.id) : 1;

  // Fetch product data
  const [productRows] = await connection.execute(
    "SELECT id, name, description, image FROM products WHERE id = ?",
    [productId]
  );
  const product = (productRows as Product[])[0];

  // Fetch option groups from the product_options table for this product.
  const [optionRows] = await connection.execute(
    "SELECT `group`, GROUP_CONCAT(name SEPARATOR '|') AS options FROM product_options WHERE product_id = ? GROUP BY `group`",
    [product.id]
  );
  const optionGroups: OptionGroup[] = (optionRows as { group: string; options: string }[]).map((row) => ({
    group: row.group,
    options: row.options.split("|"),
  }));

  // Fetch pricing information
  const [pricingRows] = await connection.execute(
    "SELECT base_price, discount, final_price FROM product_pricing WHERE product_id = ?",
    [product.id]
  );
  const pricing: Pricing = (pricingRows as Pricing[])[0];

  await connection.end();

  // If product not found, return 404.
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
      optionGroups,
      pricing,
    },
  };
};

export default ProductPage;
