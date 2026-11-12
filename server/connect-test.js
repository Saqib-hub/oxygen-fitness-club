require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to the local .env file.');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  console.log('✅ MongoDB connection test succeeded');
  await mongoose.disconnect();
}

testConnection().catch(async (error) => {
  const code = error.code || (error.cause && error.cause.code);

  console.error(
    `❌ MongoDB connection test failed (${error.name || 'Error'}${code ? `, ${code}` : ''}).`
  );

  if (code === 'ETIMEOUT' || /queryTxt|querySrv/i.test(error.message || '')) {
    console.error(
      'Atlas DNS lookup timed out. Check the cluster hostname in MONGO_URI and your ' +
      'network/VPN DNS or firewall. Try a trusted network if DNS queries are blocked.'
    );
  } else {
    console.error(
      'Check the MONGO_URI credentials, Atlas cluster status, and Atlas Network Access list.'
    );
  }

  await mongoose.disconnect();
  process.exitCode = 1;
});
