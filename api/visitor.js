// api/visitor.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'admin'; // Replace with your actual DB name

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('visitors');

    const result = await collection.findOneAndUpdate(
      { _id: 'counter' },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    res.status(200).json({ count: result.value.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
