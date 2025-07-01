const express = require('express');
<<<<<<< HEAD
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
=======
const app = express();
app.use(express.json());

let merchants = {};
let orders = [];   

let orderIdCounter = 1;

// payment method for merchant storage
app.post('/merchant/payment-method', (req, res) => {
  const { merchantId, paymentMethod } = req.body;
  if (!merchantId || !paymentMethod) return res.status(400).json({ error: 'Missing data' });
>>>>>>> ea2f976491043909332168bb4380ff413ef48f70

  merchants[merchantId] = { paymentMethod };
  res.json({ message: 'Payment method saved.' });
});

<<<<<<< HEAD
// Place an order
=======
// order placement
>>>>>>> ea2f976491043909332168bb4380ff413ef48f70
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
<<<<<<< HEAD
  res.json({ message: 'Order placed', order });
});

// Get all orders
=======

  // payment information
  setTimeout(() => {
    const foundOrder = orders.find(o => o.id === order.id);
    if (foundOrder) {
      foundOrder.status = 'paid';
      console.log(`Order #${foundOrder.id} marked as PAID.`);
    }
  }, 5000); // 5 seconds

  res.json({ message: 'Order placed.', order });
});

// Get orders
>>>>>>> ea2f976491043909332168bb4380ff413ef48f70
app.get('/orders', (req, res) => {
  res.json(orders);
});

<<<<<<< HEAD
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
=======
// Get a single order
app.get('/order/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Simulate payment manually
app.post('/order/:id/simulate-payment', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = 'paid';
  res.json({ message: `Order #${order.id} marked as paid.` });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
>>>>>>> ea2f976491043909332168bb4380ff413ef48f70
