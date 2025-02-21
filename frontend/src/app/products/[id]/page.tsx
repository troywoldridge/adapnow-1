// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import mysql from "mysql2/promise";
import ClientProductView from "./ClientProductView";

export const dynamic = "force-dynamic"; 
// (Optional) ensures each request is always fetched at runtime, not cached

/** The dynamic route’s server component. */
export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  
  // 1) Load product from DB
  const product = await loadProductById(productId);
  if (!product) {
    // If not found, render a 404
    notFound();
  }

  // 2) Load option details & group them
  const optionDetails = await loadOptionDetailsForProduct(product.id);
  const groupedOptions = groupOptions(optionDetails);

  // 3) Possibly load initial or lowest price
  const initialPrice = await loadInitialPrice(product.id);

  // 4) Render a client component for interactive logic
  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>

      {/* 
        Pass data to a client component that 
        handles user selections & dynamic price requests.
      */}
      <ClientProductView
        product={product}
        groupedOptions={groupedOptions}
        initialPrice={initialPrice}
      />
    </div>
  );
}

/** ------------- Database helpers ------------- **/

/** Create a pool once (in a real app, move to a separate util if desired) */
async function getPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

async function loadProductById(id: number) {
  const pool = await getPool();
  const [rows] = await pool.execute<any[]>(
    `SELECT id, name, slug, description, base_price
     FROM products
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
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

async function loadOptionDetailsForProduct(productId: number) {
  const pool = await getPool();

  // 1) Possibly load product_option_chains
  const [chainRows] = await pool.execute<any[]>(
    `SELECT option_chain FROM product_option_chains WHERE product_id = ? LIMIT 1`,
    [productId]
  );
  if (chainRows.length === 0) return [];

  const chainString = chainRows[0].option_chain; // e.g. "4-5-6-7"
  const optionIds = chainString.split("-").map(Number);
  if (optionIds.length === 0) return [];

  // 2) Load details
  const [detailRows] = await pool.execute<any[]>(
    `SELECT id, \`group\`, name 
     FROM product_option_details
     WHERE id IN (?)
       AND hidden = 0`,
    [optionIds]
  );
  return detailRows.map((row) => ({
    id: row.id,
    group: row.group,
    name: row.name,
  }));
}

async function loadInitialPrice(productId: number) {
  const pool = await getPool();
  const [priceRows] = await pool.execute<any[]>(
    `SELECT MIN(final_price) AS minPrice
     FROM product_pricing
     WHERE product_id = ?`,
    [productId]
  );
  if (priceRows.length > 0 && priceRows[0].minPrice !== null) {
    return parseFloat(priceRows[0].minPrice);
  }

  // Otherwise fallback to base_price
  const product = await loadProductById(productId);
  return product ? product.base_price : 0.0;
}

/** groupOptions helper */
function groupOptions(details: { id: number; group: string; name: string }[]) {
  return details.reduce((acc: Record<string, string[]>, row) => {
    if (!acc[row.group]) {
      acc[row.group] = [];
    }
    acc[row.group].push(row.name);
    return acc;
  }, {});
}
