const express = require('express');
const app = express();
app.use(express.json());

let merchants = {};  // { merchantId: { paymentMethod } }
let orders = [];     // [{ id, merchantId, customerId, product, total, status }]

let orderIdCounter = 1;

// Store merchant payment method
app.post('/merchant/payment-method', (req, res) => {
  const { merchantId, paymentMethod } = req.body;
  if (!merchantId || !paymentMethod) return res.status(400).json({ error: 'Missing data' });

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

  // Simulate payment confirmation
  setTimeout(() => {
    const foundOrder = orders.find(o => o.id === order.id);
    if (foundOrder) {
      foundOrder.status = 'paid';
      console.log(`Order #${foundOrder.id} marked as PAID.`);
    }
  }, 5000); // 5 seconds

  res.json({ message: 'Order placed.', order });
});

// Get all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Get single order
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