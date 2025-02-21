"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
}

type GroupedOptions = Record<string, string[]>;

interface ClientProductViewProps {
  product: Product;
  groupedOptions: GroupedOptions;
  initialPrice: number;
}

export default function ClientProductView({
  product,
  groupedOptions,
  initialPrice,
}: ClientProductViewProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [price, setPrice] = useState<number>(initialPrice);

  // Initialize default selections
  useEffect(() => {
    const defaults: Record<string, string> = {};
    Object.entries(groupedOptions).forEach(([group, values]) => {
      if (values.length) {
        defaults[group] = values[0];
      }
    });
    setSelectedOptions(defaults);
  }, [groupedOptions]);

  // Handle user selecting an option
  function handleOptionChange(group: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [group]: value }));
  }

  // Recalculate price client-side via route handler
  useEffect(() => {
    if (!product || Object.keys(selectedOptions).length === 0) return;

    async function fetchPrice() {
      try {
        const res = await fetch(`/api/products/${product.id}/price`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedOptions),
        });
        const data = await res.json();
        if (data.success) {
          setPrice(data.price);
        }
      } catch (err) {
        console.error("Price update error:", err);
      }
    }
    fetchPrice();
  }, [selectedOptions, product]);

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Render option dropdowns */}
      {Object.entries(groupedOptions).map(([groupName, values]) => (
        <div className="mb-4" key={groupName}>
          <label className="block font-medium mb-1">{groupName}</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedOptions[groupName] || ""}
            onChange={(e) => handleOptionChange(groupName, e.target.value)}
          >
            {values.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="text-xl font-bold mt-4">
        Price: ${price.toFixed(2)}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-700"
        onClick={() => alert(`Add to cart: $${price.toFixed(2)}`)}
      >
        Add to Cart
      </button>
    </div>
  );
}
