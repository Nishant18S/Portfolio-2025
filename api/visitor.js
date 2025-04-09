// /api/visitor.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:Aliva12@project.ssjeobe.mongodb.net/?retryWrites=true&w=majority&appName=project";
const dbName = "project";
const collectionName = "visitors";

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send("Method Not Allowed");

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(
      { _id: "visitor-counter" },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    const visitorCount = result.value.count || 4350;
    res.status(200).json({ count: visitorCount });
  } catch (error) {
    console.error("MongoDB Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
