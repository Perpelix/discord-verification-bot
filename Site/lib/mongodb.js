const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URL;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URL) {
  throw new Error('Please add your Mongo URI to .env');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function getDatabase() {
  const client = await clientPromise;
  return client.db('verification_bot');
}

module.exports = { getDatabase, clientPromise };
