import React from "react";
import { connectHits } from "react-instantsearch-dom";
import Link from "next/link";

/**
 * The 'sendEvent' function is automatically provided by React InstantSearch
 * in the 'InfiniteHits' or 'Hits' widget. We'll need to override the default
 * item template to capture custom events (click, conversion).
 */
function CustomHitsBase({ hits, sendEvent }: any) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {hits.map((hit: any, index: number) => {
        return (
          <div
            key={hit.objectID}
            style={{ border: "1px solid #ccc", padding: "1rem" }}
          >
            <h2>{hit.name}</h2>
            <p>{hit.description}</p>
            <p>Price: ${hit.price}</p>

            {/* 
              Step 5: Link to Product detail page, passing objectID and queryID 
              (so we can track conversions back to the original search).
            */}
            <Link
              href={{
                pathname: "/product/[id]",
                query: { id: hit.objectID, qid: hit.__queryID },
              }}
            >
              <a style={{ color: "blue", textDecoration: "underline" }}>
                View Product
              </a>
            </Link>

            {/* 
              Step 6: "Add to Cart" button triggers a custom conversion event 
              using the "sendEvent" function from InstantSearch.
            */}
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => {
                // "conversion" is the type, "Added to Cart" is the event name
                sendEvent("conversion", hit, "Added to Cart", {
                  // optional data
                  eventSubtype: "addToCart",
                  value: hit.price,
                  currency: "USD",
                });

                alert(`Added ${hit.name} to cart!`);
              }}
            >
              Add to Cart
            </button>

            {/* 
              Step 7: "Purchase" button triggers a custom "purchase" event
            */}
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => {
                sendEvent("conversion", hit, "Purchased", {
                  eventSubtype: "purchase",
                  // "objectData" can include discount, quantity, etc.
                  objectData: [
                    {
                      discount: hit.discount || 0,
                      price: hit.price,
                      quantity: 1,
                      queryID: hit.__queryID, // tie back to search
                    },
                  ],
                  value: hit.price,
                  currency: "USD",
                });

                alert(`Purchased ${hit.name}!`);
              }}
            >
              Purchase
            </button>
          </div>
        );
      })}
    </div>
  );
}

const CustomHits = connectHits(CustomHitsBase);
export default CustomHits;
// This code defines a CustomHits component that displays search results from Algolia.
// It includes product details, a link to the product page, and buttons for adding to cart and purchasing.
// The component uses Algolia's connectHits to connect to the search state and send custom events for tracking user interactions.
// The component is styled using inline styles and includes a grid layout for the product cards.
// The component is designed to be used within an Algolia InstantSearch context, allowing for real-time search and event tracking.
// The component is exported for use in other parts of the application.
// The component is designed to be reusable and can be easily integrated into a larger search interface.
// The component is designed to enhance the user experience by providing quick access to product information and actions.
// The component is designed to be responsive and user-friendly, making it easy for users to navigate and interact with the search results.
