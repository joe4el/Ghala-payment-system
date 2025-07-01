const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let merchants = {};
let orders = [];
let orderIdCounter = 1;

app.post("/merchant/payment-method", (req, res) => {
  const { merchantId, paymentMethod } = req.body;
  if (!merchantId || !paymentMethod) {
    return res.status(400).json({ error: "Missing data" });
  }

  merchants[merchantId] = { paymentMethod };
  res.json({ message: "Payment method saved." });
});

app.post("/order", (req, res) => {
  const { merchantId, customerId, product, total } = req.body;
  if (!merchantId || !customerId || !product || !total) {
    return res.status(400).json({ error: "Missing order data" });
  }

  const order = {
    id: orderIdCounter++,
    merchantId,
    customerId,
    product,
    total,
    status: "pending",
  };

  orders.push(order);
  res.json({ message: "Order placed", order });
});

app.patch("/order/confirm/:orderId", (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = "confirmed";
  res.json({ message: "Order confirmed", order });
});

// ✅ Use dynamic port for Render or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
