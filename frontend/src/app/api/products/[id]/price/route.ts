// app/api/products/[id]/price/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const productId = Number(params.id);
  const body = await request.json(); // { size: '12x12', quantity: '100', etc. }

  // 1) Load base product or do custom logic
  const price = await calculatePrice(productId, body);
  
  return NextResponse.json({
    success: true,
    price,
  });
}

async function calculatePrice(productId: number, selectedOptions: Record<string, string>) {
  // Example logic: load base product price, then add surcharges
  // or do a db lookup for that exact combination, etc.
  
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // e.g. get base product
  const [rows] = await pool.execute<any[]>(
    `SELECT base_price FROM products WHERE id=? LIMIT 1`,
    [productId]
  );
  if (!rows.length) {
    return 0;
  }

  let final = parseFloat(rows[0].base_price);

  // If user selected a certain finishing or size, you can add to final
  if (selectedOptions.finishing === "4 Grommets Corners") {
    final += 2.0;
  }
  if (selectedOptions.size === "36x48") {
    final += 10.0;
  }
  // etc...

  // Also factor in quantity if needed
  const qty = parseInt(selectedOptions.quantity || "1", 10);
  final *= qty;

  return final;
}
