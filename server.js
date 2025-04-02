const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // รองรับ JSON body

// ✅ Root ใช้เช็คว่า server ทำงาน
app.get('/', (req, res) => {
  res.send('🎉 Backend is alive!');
});

// ✅ รับ Webhook และบันทึกข้อมูลลง transactions.json
app.post('/webhook', (req, res) => {
  const newTransaction = {
    txid: req.body.txid || `TX${Date.now()}`,
    amount: req.body.amount || 0,
    status: req.body.status || 'pending',
    by: req.body.by || 'unknown',
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'data', 'transactions.json');

  // อ่านข้อมูลเก่า
  const transactions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // เพิ่มรายการใหม่
  transactions.push(newTransaction);

  // เขียนกลับลงไฟล์
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

  console.log('✅ Webhook received:', newTransaction);
  res.status(200).json({ message: 'Transaction saved', data: newTransaction });
});

// ✅ ดึงรายการเฉพาะที่ชำระเงินสำเร็จ
app.get('/transactions/success', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'transactions.json');
  const transactions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const successOnly = transactions.filter(tx => tx.status === 'success');

  res.json(successOnly);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
