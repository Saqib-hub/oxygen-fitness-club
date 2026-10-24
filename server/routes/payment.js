const express = require('express');
const router = express.Router();
const { Safepay } = require('@sfpy/node-sdk');

// Safepay SDK Initialize (Official tareeka)
const safepay = new Safepay({
  environment: 'sandbox',
  apiKey: 'sec_e6020c08-184c-4508-abee-5b4fa7aba45f', // Public Key
  v1Secret: 'aeeb0985f7ad6add582183d85b7b3dd85e8029206aeb9d2243ac1b3a10bb87bf', // Secret Key
  webhookSecret: 'aeeb0985f7ad6add582183d85b7b3dd85e8029206aeb9d2243ac1b3a10bb87bf'
});

router.post('/create-payment', async (req, res) => {
  try {
    const { amount } = req.body;

    // 1. Payment token create karo (Amount ko paise me convert karo)
    const { token } = await safepay.payments.create({
      amount: amount * 100, // 800 Rs = 80000 paise
      currency: 'PKR'
    });

    // 2. Checkout URL generate karo (Aapka Vercel Live Link yahan daal diya hai)
    const url = await safepay.checkout.create({
      token: token,
      orderId: `OFC-${Date.now()}`,
      cancelUrl: 'https://oxygen-fitness-club-five.vercel.app/join.html',
      redirectUrl: 'https://oxygen-fitness-club-five.vercel.app/join.html',
      source: 'custom',
      webhooks: false
    });

    res.json({ success: true, paymentUrl: url });
  } catch (err) {
    console.error('Safepay Error:', err.message);
    // Asli error frontend ko bhejo
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;