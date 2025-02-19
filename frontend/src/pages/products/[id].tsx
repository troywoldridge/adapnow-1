import React, { useState, useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import Link from "next/link";

// ---------------------
//  INTERFACES
// ---------------------
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  base_price: number;
}

interface OptionGroup {
  id: number;
  name: string;
  options: { id: number; name: string }[];
}

// ---------------------
//  COMPONENT
// ---------------------
const ProductPage: React.FC<{ product: Product; optionGroups: OptionGroup[] }> = ({
  product,
  optionGroups,
}) => {
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState(product.base_price);

  // Update price when options change
  useEffect(() => {
    if (selectedOptions.length === 0) {
      setCalculatedPrice(product.base_price);
      return;
    }

    // Fetch new price from Laravel API
    const fetchUpdatedPrice = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculate_price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, options: selectedOptions }),
      });
      const data = await response.json();
      if (data.price) setCalculatedPrice(data.price);
    };

    fetchUpdatedPrice();
  }, [selectedOptions, product.base_price, product.id]);

  // Handle option selection
  const handleOptionChange = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      {/* Back to Products Link */}
      <Link href="/products" className="text-blue-600 hover:underline">
        &larr; Back to Products
      </Link>

      {/* Product Image & Details */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Product Image */}
        <div className="flex-1">
          <Image src={product.image} alt={product.name} width={500} height={500} />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-xl font-bold mt-4">${calculatedPrice.toFixed(2)}</p>

          {/* Options */}
          {optionGroups.map((group) => (
            <div key={group.id} className="mt-4">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              {group.options.map((option) => (
                <div key={option.id} className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionChange(option.id)}
                    className="mr-2"
                  />
                  <label>{option.name}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
