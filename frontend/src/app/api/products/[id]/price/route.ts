import { NextApiRequest, NextApiResponse } from 'next';

// Example: /api/products/123/price
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query; // product ID from URL
  const chosenOptions = req.body; // e.g. { size: '3.5 x 2', qty: '500', Coating: 'Uncoated' }

  try {
    // 1. Build a hash from chosen options
    //    Sort keys for consistency
    const hash = buildHash(chosenOptions);

    // 2. Look up price in product_pricing by product_id + hash
    let finalPrice = await findPriceByHash(Number(id), hash);

    // 3. If not found, do fallback or custom logic
    if (finalPrice === null) {
      // Fallback to product base price or do a custom calculation
      finalPrice = 0.0;
    }

    return res.json({ success: true, price: finalPrice });
  } catch (error) {
    console.error('Error in price API:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Helper to build a stable hash from chosen options
function buildHash(options: Record<string, string>): string {
  const sortedKeys = Object.keys(options).sort();
  const pairs = sortedKeys.map((key) => `${key}=${options[key]}`);
  return pairs.join('|'); // e.g. "Coating=Uncoated|qty=500|size=3.5 x 2"
}

// Pseudo-DB function to find a price
async function findPriceByHash(productId: number, hash: string): Promise<number | null> {
  // e.g. SELECT final_price FROM product_pricing WHERE product_id=? AND hash=?
  // If found, return the final_price. Otherwise, return null.
  // This is just an example returning a random number for illustration.
  const mockData: Record<string, number> = {
    'Coating=Uncoated|qty=50|size=3.5 x 2': 15.99,
    'Coating=Uncoated|qty=100|size=3.5 x 2': 25.99,
    // ...
  };
  return mockData[hash] ?? null;
}
