import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Elizabeth71676!',
  database: 'adapnow_db',
});

// Fetch Order Details Endpoint
app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;

  // Query for order details
  const orderQuery = `
    SELECT * FROM orders WHERE order_id = ?
  `;

  db.query(orderQuery, [orderId], (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orderResults[0];

    // Query for order items
    const itemsQuery = `
      SELECT product_name, quantity, price FROM order_items WHERE order_id = ?
    `;

    db.query(itemsQuery, [order.id], (err, itemResults) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch order items.' });
      }

      // Combine order details and items
      const orderDetails = {
        order_id: order.order_id,
        total_price: order.total_price,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        email: order.email,
        address: order.address,
        city: order.city,
        state: order.state,
        zip: order.zip,
        country: order.country,
        status: order.status,
        items: itemResults,
      };

      res.json({ success: true, order: orderDetails });
    });
  });
});

app.listen(3001, () => {
  console.log('Order Details API running on http://localhost:3001');
});

export default app;
