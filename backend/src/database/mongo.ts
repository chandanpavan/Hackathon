import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agritrust";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (db) return db; // Reuse existing connection

  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(); // Default DB from URI
    console.log("✅ Connected to MongoDB (AgriTrust)");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getDb(): Db {
  if (!db) throw new Error("❌ MongoDB not connected yet");
  return db;
}
