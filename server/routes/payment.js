const express = require('express');
const router = express.Router();

router.post('/create-payment', (req, res) => {
  // Koi API nahi, direct success (Server crash nahi hoga)
  res.json({ success: true, paymentUrl: `/manual-payment.html?amount=${req.body.amount}` });
});

module.exports = router;