/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

/**
 * The 'sendEvent' function is automatically provided by React InstantSearch
 * in the 'InfiniteHits' or 'Hits' widget. We'll need to override the default
 * item template to capture custom events (click, conversion).
 */
export function CustomHitsBase({ hits, sendEvent }: any) {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {hits.map((hit: any) => {  // ✅ Removed "index" since it's not used
          return (
            <div
              key={hit.objectID}
              style={{ border: "1px solid #ccc", padding: "1rem" }}
            >
              <h2>{hit.name}</h2>
              <p>{hit.description}</p>
              <p>Price: ${hit.price}</p>
  
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
  
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => {
                  sendEvent("conversion", hit, "Added to Cart", {
                    eventSubtype: "addToCart",
                    value: hit.price,
                    currency: "USD",
                  });
  
                  alert(`Added ${hit.name} to cart!`);
                }}
              >
                Add to Cart
              </button>
  
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => {
                  sendEvent("conversion", hit, "Purchased", {
                    eventSubtype: "purchase",
                    objectData: [
                      {
                        discount: hit.discount || 0,
                        price: hit.price,
                        quantity: 1,
                        queryID: hit.__queryID,
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
  