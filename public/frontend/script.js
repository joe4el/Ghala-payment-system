const API_BASE = 'http://localhost:3000';

document.getElementById('payment-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    merchantId: document.getElementById('merchantId').value,
    paymentMethod: {
      label: document.getElementById('label').value,
      provider: document.getElementById('provider').value,
      config: {
        phoneNumber: document.getElementById('phone').value,
        currency: document.getElementById('currency').value,
      }
    }
  };

  const res = await fetch(`${API_BASE}/merchant/payment-method`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message || 'Saved');
});

async function loadOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  const orders = await res.json();

  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = '';

  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.product}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
      <td><button onclick="simulatePayment(${order.id})">Simulate Payment</button></td>
    `;
    tbody.appendChild(row);
  });
}

async function simulatePayment(orderId) {
  await fetch(`${API_BASE}/order/${orderId}/simulate-payment`, {
    method: 'POST'
  });
  alert(`Payment simulated for order ${orderId}`);
  loadOrders();
}

window.onload = loadOrders;