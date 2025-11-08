import { Document, WithId } from "mongodb";
import { getDb } from "./db";

// =========================
// 📘 USER COLLECTION
// =========================
export interface UserDoc extends WithId<Document> {
  id?: string;
  name: string;
  email: string;
  password_hash: string;
  role: "farmer" | "consumer";
  ethereum_address?: string | null;
}

export const findUserByEmail = async (email: string): Promise<UserDoc | null> => {
  const db = await getDb();
  return db.collection<UserDoc>("users").findOne({ email });
};

export const createUser = async (params: {
  name: string;
  email: string;
  passwordHash: string;
  role: "farmer" | "consumer";
}): Promise<string> => {
  const db = await getDb();
  const res = await db.collection<UserDoc>("users").insertOne({
    name: params.name,
    email: params.email,
    password_hash: params.passwordHash,
    role: params.role,
    ethereum_address: null,
  } as any);
  return String(res.insertedId);
};

// =========================
// 🌾 LAND COLLECTION
// =========================
export interface LandDoc extends WithId<Document> {
  id: string;
  name: string;
  current_crop: string;
  owner_id?: string;
  last_updated?: Date | null;
  last_cid?: string | null;
}

export const getLandForOwner = async (ownerId: string): Promise<LandDoc[]> => {
  const db = await getDb();
  return db
    .collection<LandDoc>("land_parcels")
    .find({ owner_id: ownerId })
    .sort({ name: 1 })
    .toArray();
};

export const getLandVisibleToRole = async (
  _role: "farmer" | "consumer",
  _ownerId?: string
): Promise<LandDoc[]> => {
  const db = await getDb();
  return db.collection<LandDoc>("land_parcels").find({}).sort({ name: 1 }).toArray();
};

// =========================
// 🔗 RECORD COLLECTION
// =========================
export interface RecordDoc extends WithId<Document> {
  id?: string;
  transaction_hash: string; // SHA-256 hash
  land_id: string;
  farmer_address: string;
  timestamp: Date;
  soil_moisture: number;
  temperature: number;
  cid: string;
  status: "pending" | "verified";
}

export const insertRecord = async (doc: RecordDoc): Promise<void> => {
  const db = await getDb();
  await db.collection<RecordDoc>("agri_transactions").insertOne({ ...doc });
  console.log("✅ Record inserted into MongoDB");
};

export const findRecords = async (landId?: string): Promise<RecordDoc[]> => {
  const db = await getDb();
  const query: any = landId ? { land_id: landId } : {};
  return db
    .collection<RecordDoc>("agri_transactions")
    .find(query)
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();
};

export const findByCid = async (cid: string): Promise<RecordDoc | null> => {
  const db = await getDb();
  return db.collection<RecordDoc>("agri_transactions").findOne({ cid });
};
