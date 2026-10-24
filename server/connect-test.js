const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS

const mongoose = require('mongoose');

// Atlas SRV ko resolve karo Google DNS se
dns.resolveSrv('_mongodb._tcp.cluster0.o5jpido.mongodb.net', (err, records) => {
  if (err) {
    console.log('❌ DNS Blocked:', err.message);
    return;
  }
  
  console.log('✅ DNS Resolved! IPs mil gaye.');
  
  // Direct IP connection string banao
  const hosts = records.map(r => `${r.name}:${r.port}`).join(',');
  const uri = `mongodb://javaidsaqib202_db_user:Oxygen2025Pass@${hosts}/oxygenFitness?ssl=true&replicaSet=atlas-11h0g4-shard-0&authSource=admin&retryWrites=true&w=majority`;
  
  // Connect karo
  mongoose.connect(uri)
    .then(() => console.log('✅ SUCCESS! MongoDB Connected via Direct IP.'))
    .catch(err => console.log('❌ Connection Error:', err.message));
});