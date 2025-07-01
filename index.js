const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static frontend files (like index.html) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for merchants and orders
let merchants = {};  // { merchantId: { paymentMethod } }
let orders = [];     // [{ id, merchantId, customerId, product, total, status }]
let orderIdCounter = 1;

// Simple homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Store merchant payment method
app.post('/merchant/payment-method', (req, res) => {
  const { merchantId, paymentMethod } = req.body;
  if (!merchantId || !paymentMethod) {
    return res.status(400).json({ error: 'Missing data' });
  }

  merchants[merchantId] = { paymentMethod };
  res.json({ message: 'Payment method saved.' });
});

// Place an order
app.post('/order', (req, res) => {
  const { merchantId, customerId, product, total } = req.body;
  if (!merchantId || !customerId || !product || !total) {
    return res.status(400).json({ error: 'Missing order data' });
  }

  const order = {
    id: orderIdCounter++,
    merchantId,
    customerId,
    product,
    total,
    status: 'pending',
  };

  orders.push(order);
  res.json({ message: 'Order placed', order });
});

// Get all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Confirm an order by ID
app.patch('/order/confirm/:orderId', (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = 'confirmed';
  res.json({ message: 'Order confirmed', order });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
