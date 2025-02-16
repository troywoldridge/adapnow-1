// pages/product/[id].tsx
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function ProductDetail() {
  const router = useRouter();
  const { id, qid } = router.query;

  // For demonstration, let's show them on screen
  useEffect(() => {
    console.log("Product ID:", id);
    console.log("Query ID:", qid);
  }, [id, qid]);

  // If we wanted to do "addedToCartObjectIDsAfterSearch" manually here,
  // we could do something like:
  const handleAddToCart = () => {
    if (typeof window !== "undefined") {
      window.aa("addedToCartObjectIDsAfterSearch", {
        eventName: "Product Added to Cart (Detail Page)",
        index: "YourIndexName",
        queryID: qid, // pass the queryID from the search
        objectIDs: [id],
        objectData: [
          {
            price: 19.99,
            discount: 3.99,
            quantity: 1,
          },
        ],
        currency: "USD",
      });
      alert("Added to cart from product detail!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Product Detail Page</h1>
      <p>Product ID: {id}</p>
      <p>Query ID: {qid}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
// This code sets up a product detail page in a Next.js application.
// It retrieves the product ID and query ID from the URL parameters and displays them.
// It also includes a button to simulate adding the product to the cart, which triggers an event using Algolia's analytics.
// The event includes details like the product's price, discount, quantity, and currency.
// The component uses the useRouter hook from Next.js to access the router object and manage URL parameters.
// The useEffect hook is used to log the product ID and query ID when they change.
// The component is exported for use in other parts of the application.
// The component is styled with inline styles and includes a button for adding the product to the cart.
// The component is designed to be used within a Next.js application, allowing for server-side rendering and dynamic routing.