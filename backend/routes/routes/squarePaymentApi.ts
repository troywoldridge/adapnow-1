// Backend API - Square Payment Processing Example
import express from 'express';
import bodyParser from 'body-parser';
import { Client, Environment, ApiError } from 'square';

const app = express();
app.use(bodyParser.json());

// Initialize Square Client
const squareClient = new Client({
  environment: Environment.Sandbox, // Switch to Production when live
  accessToken: process.env.SQUARE_ACCESS_TOKEN, // Set in environment variables
});

const paymentsApi = squareClient.paymentsApi;

app.post('/api/square/payment', async (req, res) => {
  const { total, paymentMethod, details, cart } = req.body;

  try {
    // Create Payment Request
    const paymentResponse = await paymentsApi.createPayment({
      sourceId: 'cnon:card-nonce-ok', // Replace with actual nonce from Square frontend SDK
      idempotencyKey: crypto.randomUUID(), // Ensure unique requests
      amountMoney: {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'USD',
      },
    });

    res.json({ success: true, paymentId: paymentResponse.result.payment.id });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(error.errors);
    } else {
      console.error(error);
    }
    res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
});

app.listen(3001, () => {
  console.log('Square Payment API running on http://localhost:3001');
});

export default app;

