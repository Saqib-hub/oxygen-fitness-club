const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    res.status(503).json({
      success: false,
      message: 'Database is temporarily unavailable. Please try again shortly.'
    });
  }
});

const registerRoute = require('./routes/register');
const contactRoute = require('./routes/contact');
const adminRoute = require('./routes/admin');
const paymentRoute = require('./routes/payment');

app.use('/api', registerRoute);
app.use('/api', contactRoute);
app.use('/api', adminRoute);
app.use('/api', paymentRoute);

const PORT = process.env.PORT || 3000;
const MAX_DB_CONNECT_ATTEMPTS = 3;
let databaseConnectionPromise;

function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error('MONGO_URI is missing.'));
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    }).then(() => {
      console.log('✅ MongoDB connected');
    }).catch((error) => {
      databaseConnectionPromise = undefined;
      throw error;
    });
  }

  return databaseConnectionPromise;
}

function logDatabaseConnectionError(error, attempt) {
  const code = error.code || (error.cause && error.cause.code);
  const isDnsFailure =
    code === 'ETIMEOUT' ||
    code === 'ENOTFOUND' ||
    code === 'EAI_AGAIN' ||
    /queryTxt|querySrv/i.test(error.message || '');

  console.error(
    `❌ MongoDB connection attempt ${attempt}/${MAX_DB_CONNECT_ATTEMPTS} failed ` +
    `(${error.name || 'Error'}${code ? `, ${code}` : ''}).`
  );

  if (isDnsFailure) {
    console.error(
      'DNS could not resolve the MongoDB Atlas cluster. Check the MONGO_URI hostname, ' +
      'your network/VPN DNS, and whether outbound DNS traffic is allowed.'
    );
  } else if (/authentication/i.test(error.message || '')) {
    console.error(
      'MongoDB authentication failed. Check the database username/password in MONGO_URI ' +
      'and ensure special characters in the password are URL-encoded.'
    );
  } else {
    console.error(
      'Check that the Atlas cluster is running and that this server IP is allowed in ' +
      'the Atlas Network Access list.'
    );
  }
}

mongoose.connection.on('disconnected', () => {
  console.error('⚠️ MongoDB disconnected. API requests will return HTTP 503 until it reconnects.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(`❌ MongoDB connection error: ${error.name || 'Error'}`);
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing. Add it to the local .env file.');
    process.exitCode = 1;
    return;
  }

  for (let attempt = 1; attempt <= MAX_DB_CONNECT_ATTEMPTS; attempt += 1) {
    try {
      await connectToDatabase();
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
      return;
    } catch (error) {
      logDatabaseConnectionError(error, attempt);

      if (attempt < MAX_DB_CONNECT_ATTEMPTS) {
        const delayMs = attempt * 2000;
        console.error(`Retrying MongoDB connection in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  console.error('❌ MongoDB is still unavailable. Server was not started.');
  await mongoose.disconnect();
  process.exitCode = 1;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`❌ Server startup failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = app;
