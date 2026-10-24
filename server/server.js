const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS (Network block bypass)
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err.message));

// Routes
const registerRoute = require('./routes/register');
const contactRoute = require('./routes/contact');
const adminRoute = require('./routes/admin');
const paymentRoute = require('./routes/payment'); // 👈 Ye line add ki

app.use('/api', registerRoute);
app.use('/api', contactRoute);
app.use('/api', adminRoute);
app.use('/api', paymentRoute); // 👈 Ye line add ki

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});