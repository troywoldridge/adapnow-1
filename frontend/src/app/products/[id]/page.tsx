import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
// import { execute } from '@/lib/db';
import mysql, { Pool } from 'mysql2/promise';

/**********************************************
 * Types & Interfaces
 **********************************************/
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
}

export interface ProductOptionDetail {
  id: number;
  group: string;
  name: string;
}

export type GroupedOptions = Record<string, string[]>;

interface ProductPageProps {
  product: Product;
  groupedOptions: GroupedOptions;
  initialPrice: number; // or null if none
}

/**********************************************
 * Page Component
 **********************************************/
const ProductPage: NextPage<ProductPageProps> = ({
  product,
  groupedOptions,
  initialPrice,
}) => {
  // State to track the user’s selections
  // For each group, we store the selected value
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [price, setPrice] = useState<number>(initialPrice);

  // On mount, set default selections to the first item in each group (if desired)
  useEffect(() => {
    const defaults: { [key: string]: string } = {};
    Object.entries(groupedOptions).forEach(([group, values]) => {
      if (values.length > 0) {
        defaults[group] = values[0];
      }
    });
    setSelectedOptions(defaults);
  }, [groupedOptions]);

  // Handler when an option changes
  const handleOptionChange = (group: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [group]: value }));
  };

  // Recalculate price each time selectedOptions changes
  useEffect(() => {
    if (Object.keys(selectedOptions).length === 0) return;

    // Call our API route to get the updated price
    const fetchPrice = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedOptions),
        });
        const data = await response.json();
        if (data.success) {
          setPrice(data.price);
        }
      } catch (err) {
        console.error('Error updating price:', err);
      }
    };

    fetchPrice();
  }, [selectedOptions, product.id]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* Option Selects */}
      {Object.entries(groupedOptions).map(([groupName, values]) => (
        <div key={groupName} style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '0.5rem' }}>{groupName}:</label>
          <select
            value={selectedOptions[groupName] || ''}
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

      {/* Display Price */}
      <div style={{ marginTop: '1.5rem', fontSize: '1.2rem' }}>
        <strong>Price:</strong> ${price.toFixed(2)}
      </div>

      {/* Add to Cart Button (example) */}
      <button
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        onClick={() => {
          // Example: add to cart logic
          alert(`Added to cart with price: $${price.toFixed(2)}`);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;

/**********************************************
 * getServerSideProps
 **********************************************/
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  // 1. Load product from DB
  const product = await loadProductById(Number(id));
  if (!product) {
    return { notFound: true };
  }

  // 2. Load product_option_details or product_option_chains
  //    to figure out which options apply. Then group them.
  const optionDetails = await loadOptionDetailsForProduct(product.id);
  // Format them into { groupName: [optionValue1, optionValue2, ...], ... }
  const groupedOptions = groupOptions(optionDetails);

  function groupOptions(optionDetails: ProductOptionDetail[]): GroupedOptions {
    return optionDetails.reduce((acc, option) => {
      if (!acc[option.group]) {
        acc[option.group] = [];
      }
      acc[option.group].push(option.name);
      return acc;
    }, {} as GroupedOptions);
  }

  // 3. Optionally load an initial or “lowest” price
  const initialPrice = await loadInitialPrice(product.id);

  return {
    props: {
      product,
      groupedOptions,
      initialPrice,
    },
  };
};

/**********************************************
 * Example DB Helpers (pseudo-code)
 **********************************************/

// Replace "db.execute(...)" with your real DB logic
// (e.g. using mysql2, Prisma, or another library).


export async function loadProductById(id: number) {
  const query = `
    SELECT
      id,
      name,
      slug,
      description,
      base_price
    FROM products
    WHERE id = ?
    LIMIT 1
  `;

  const rows: { id: number; name: string; slug: string; description: string; base_price: string; }[] = await execute(query, [id]);
  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    base_price: parseFloat(row.base_price),
  };
}

export async function loadOptionDetailsForProduct(productId: number) {
  // 1) Get the option_chain
  const chainQuery = `
    SELECT option_chain
    FROM product_option_chains
    WHERE product_id = ?
    LIMIT 1
  `;
  const chainRows = await execute(chainQuery, [productId]);

  if (chainRows.length === 0) {
    return [];
  }

  // 2) Parse the chain
  const chainString = (chainRows[0] as { option_chain: string }).option_chain; // e.g. "4-5-6-7"
  const optionIds = chainString.split('-').map(Number);

  if (optionIds.length === 0) {
    return [];
  }

  // 3) Fetch option details
  const detailsQuery = `
    SELECT
      id,
      \`group\`,
      name
    FROM product_option_details
    WHERE id IN (?)
      AND hidden = 0
  `;
  const detailRows = await execute(detailsQuery, [optionIds]);

  return (detailRows as { id: number; group: string; name: string }[]).map((row) => ({
    id: row.id,
    group: row.group,
    name: row.name,
  }));
}

export async function loadInitialPrice(productId: number) {
  const priceQuery = `
    SELECT MIN(final_price) AS minPrice
    FROM product_pricing
    WHERE product_id = ?
  `;
  const priceRows = await execute(priceQuery, [productId]);

  if (priceRows.length > 0 && (priceRows[0] as { minPrice: string | null }).minPrice !== null) {
    const minPrice = (priceRows[0] as { minPrice: string | null }).minPrice;
    return minPrice !== null ? parseFloat(minPrice) : 0.0;
  }

  // Otherwise fallback to base_price
  const product = await loadProductById(productId);
  return product ? product.base_price : 0.0;
}


const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function execute<T = unknown>(query: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    pool.execute(query, params)
      .then(([rows]) => resolve(rows as T[]))
      .catch(reject);
  });
}
