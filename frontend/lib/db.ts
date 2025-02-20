// lib/db.ts

import mysql, { Pool } from 'mysql2/promise';

/**
 * Create a connection pool to reuse connections.
 * The connection settings come from environment variables.
 * Make sure to define them in your .env or environment.
 */
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'my_database',
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

/**
 * A helper function to execute queries with the connection pool.
 * @param query  SQL query string (with ? placeholders)
 * @param params Values to replace those placeholders
 * @returns      The rows returned by the query
 */
import { RowDataPacket } from 'mysql2';

export async function execute<T extends RowDataPacket[]>(query: string, params: unknown[] = []): Promise<T> {
  const [rows] = await pool.execute<T>(query, params);
  return rows;
}
