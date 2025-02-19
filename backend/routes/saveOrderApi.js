import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import crypto from 'crypto';

app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Elizabeth71676!',
  database: 'adapnow_db',
});

// Save Order Endpoint
app.post('/api/orders', async (req, res) => {
  const { user_id, email, address, city, state, zip, country, payment_method, cart, total_price } = req.body;

  // Generate a unique order ID
  const order_id = crypto.randomUUID();

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Transaction error.' });
    }

    // Insert into orders table
    const orderQuery = `
      INSERT INTO orders (
        user_id, order_id, total_price, payment_status, payment_method, email, address, city, state, zip, country
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
      user_id || null,
      order_id,
      total_price,
      payment_method,
      email,
      address,
      city,
      state,
      zip,
      country
    ];

    db.query(orderQuery, orderValues, (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ success: false, message: 'Failed to save order.' });
        });
      }

      const orderId = result.insertId;

      // Insert into order_items table
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES ?
      `;

      const itemValues = cart.map((item) => [
        orderId,
        item.product_id,
        item.product_name,
        item.quantity,
        item.price
      ]);

      db.query(itemQuery, [itemValues], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ success: false, message: 'Failed to save order items.' });
          });
        }

        // Commit transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ success: false, message: 'Failed to finalize order.' });
            });
          }

          res.status(200).json({ success: true, order_id });
        });
      });
    });
  });
});

app.listen(3001, () => {
  console.log('Order API running on http://localhost:3001');
});

export default app;


