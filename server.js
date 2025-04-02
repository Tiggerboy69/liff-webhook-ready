const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Root: ใช้เช็กว่าเซิร์ฟเวอร์ทำงาน
app.get('/', (req, res) => {
  res.send('LIFF Webhook Server is running 🎉');
});

// ✅ Webhook: ไว้รับข้อมูลจาก Make.com / WooCommerce
app.post('/webhook', (req, res) => {
  console.log('Received Webhook:', req.body);
  res.status(200).json({ message: 'Webhook received successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
