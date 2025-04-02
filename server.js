app.post('/webhook', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'transactions.json');

    // อ่านไฟล์ก่อน ถ้ามี
    let transactions = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      transactions = JSON.parse(fileData);
    }

    // สร้างข้อมูลใหม่
    const newTransaction = {
      txid: req.body.txid || `TX${Date.now()}`,
      amount: req.body.amount || 0,
      status: req.body.status || 'pending',
      by: req.body.by || 'unknown',
      timestamp: new Date().toISOString()
    };

    // เพิ่มข้อมูลเข้า array แล้วบันทึก
    transactions.push(newTransaction);
    fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

    console.log('✅ Webhook received:', newTransaction);
    res.status(200).json({ message: 'Transaction saved', data: newTransaction });

  } catch (error) {
    // log error ลงใน Render logs
    console.error('❌ ERROR in /webhook:', error.stack);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
});
