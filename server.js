const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('🎉 Backend is alive!');
});

// Webhook route
app.post('/webhook', (req, res) => {
  try {
    console.log('📩 Raw body received:', req.body);

    const filePath = path.join(__dirname, 'data', 'transactions.json');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    let transactions = JSON.parse(rawData);

    const newTransaction = {
      txid: req.body.txid || `TX${Date.now()}`,
      amount: req.body.amount || 0,
      status: req.body.status || 'pending',
      by: req.body.by || 'unknown',
      timestamp: new Date().toISOString()
    };

    transactions.push(newTransaction);
    fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

    console.log('✅ Webhook saved:', newTransaction);
    res.status(200).json({ message: 'Transaction saved', data: newTransaction });

  } catch (error) {
    console.error('❌ ERROR in /webhook:', error.stack);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
});

// Success list route
app.get('/transactions/success', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'transactions.json');
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }
  const transactions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const successOnly = transactions.filter(tx => tx.status === 'success');
  res.json(successOnly);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
