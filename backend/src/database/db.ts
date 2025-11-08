import { MongoClient, Db } from "mongodb";
import { v4 as uuidv4 } from "uuid";

// ============================
// 🔹 MONGODB CONFIG
// ============================
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://manyah2009:Manya%402006@cluster0.0iho7ot.mongodb.net/?appName=Cluster0";
const DB_NAME = process.env.DB_NAME || "manya@2009";

let mongoClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectMongo(): Promise<Db> {
  if (cachedDb) return cachedDb;
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGO_URI, {
      // useUnifiedTopology is default in modern drivers
    });
  }
  await mongoClient.connect();
  cachedDb = mongoClient.db(DB_NAME);
  // Ensure indexes for collections
  await setupIndexes(cachedDb);
  return cachedDb;
}

async function setupIndexes(db: Db) {
  await Promise.all([
    db.collection("farmers").createIndex({ wallet_address: 1 }, { unique: false }),
    db.collection("farms").createIndex({ farmer_id: 1 }),
    db.collection("crop_cycles").createIndex({ farm_id: 1, status: 1 }),
    db.collection("soil_data").createIndex({ cycle_id: 1, reading_timestamp: -1 }),
    db.collection("blockchain_verifications").createIndex({ transaction_hash: 1 }, { unique: true }),
  ]).catch((e) => {
    console.warn("Index creation warning:", e.message || e);
  });
}

// ============================
// 🔹 HELPERS
// ============================
export async function getDb() {
  return await connectMongo();
}

export async function closeDb() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    cachedDb = null;
  }
}

// ============================
// 🔹 FARMER FUNCTIONS
// ============================
export async function getFarmerByWallet(walletAddress: string) {
  const db = await getDb();
  const wallet = walletAddress?.toLowerCase();
  return await db.collection("farmers").findOne({ wallet_address: wallet });
}

export async function getFarmerFarms(farmerId: string) {
  const db = await getDb();
  return await db.collection("farms").find({ farmer_id: farmerId }).toArray();
}

// ============================
// 🔹 CROP CYCLES & SOIL DATA
// ============================
export async function getActiveCropCycles(farmId: string) {
  const db = await getDb();
  return await db
    .collection("crop_cycles")
    .find({ farm_id: farmId, status: "active" })
    .toArray();
}

export async function addSoilDataReading(data: {
  cycleId: string;
  moisture: number;
  temperature: number;
  pH?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  blockchainTxHash?: string;
}) {
  const db = await getDb();
  const readingId = uuidv4();
  const doc = {
    reading_id: readingId,
    cycle_id: data.cycleId,
    moisture_percentage: data.moisture,
    temperature_celsius: data.temperature,
    ph_level: data.pH ?? null,
    nitrogen_level: data.nitrogen ?? null,
    phosphorus_level: data.phosphorus ?? null,
    potassium_level: data.potassium ?? null,
    reading_timestamp: new Date(),
    verified_on_blockchain: !!data.blockchainTxHash,
    blockchain_tx_hash: data.blockchainTxHash ?? null,
  } as any;

  await db.collection("soil_data").insertOne(doc);
  return readingId;
}

// ============================
// 🔹 BLOCKCHAIN VERIFICATIONS
// ============================
export async function recordBlockchainVerification(data: {
  dataType: "soil_data" | "harvest_record" | "crop_cycle";
  recordId: string;
  transactionHash: string;
  blockNumber?: number;
  ipfsHash?: string;
}) {
  const db = await getDb();
  const verificationId = uuidv4();
  const doc = {
    verification_id: verificationId,
    data_type: data.dataType,
    record_id: data.recordId,
    transaction_hash: data.transactionHash,
    block_number: data.blockNumber ?? null,
    verification_timestamp: new Date(),
    ipfs_hash: data.ipfsHash ?? null,
  } as any;
  await db.collection("blockchain_verifications").insertOne(doc);
  return verificationId;
}

// ============================
// 🔹 DATA FETCH HELPERS
// ============================
export async function getRecentSoilData(cycleId: string, limit: number = 10) {
  const db = await getDb();
  const pipeline = [
    { $match: { cycle_id: cycleId } },
    { $sort: { reading_timestamp: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "blockchain_verifications",
        let: { rid: "$reading_id" },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$record_id", "$$rid"] }, { $eq: ["$data_type", "soil_data"] }] } } },
          { $project: { transaction_hash: 1, block_number: 1, ipfs_hash: 1, _id: 0 } },
        ],
        as: "verification",
      },
    },
    { $unwind: { path: "$verification", preserveNullAndEmptyArrays: true } },
  ];

  return await db.collection("soil_data").aggregate(pipeline).toArray();
}

export async function getFarmStatus(farmId: string) {
  const db = await getDb();
  const cycles = await db.collection("crop_cycles").find({ farm_id: farmId, status: "active" }).toArray();

  const cycleData = await Promise.all(
    cycles.map(async (cycle: any) => {
      const soilData = await db
        .collection("soil_data")
        .find({ cycle_id: cycle.cycle_id })
        .sort({ reading_timestamp: -1 })
        .limit(1)
        .toArray();

      const issues = await db.collection("crop_issues").find({ cycle_id: cycle.cycle_id, resolution_date: null }).toArray();

      return {
        ...cycle,
        currentSoilData: soilData[0] || null,
        activeIssues: issues,
      };
    })
  );

  return cycleData;
}

// ============================
// 🔹 WEATHER DATA
// ============================
export async function addWeatherData(data: {
  farmId: string;
  temperature: number;
  humidity: number;
  rainfall?: number;
  windSpeed?: number;
}) {
  const db = await getDb();
  const weatherId = uuidv4();
  const doc = {
    weather_id: weatherId,
    farm_id: data.farmId,
    temperature_celsius: data.temperature,
    humidity_percentage: data.humidity,
    rainfall_mm: data.rainfall ?? null,
    wind_speed_kmh: data.windSpeed ?? null,
    reading_timestamp: new Date(),
  } as any;
  await db.collection("weather_data").insertOne(doc);
  return weatherId;
}

// ============================
// 🔹 CONNECTION TEST (light)
// ============================
(async () => {
  try {
    const db = await getDb();
    const serverStatus = await db.command({ ping: 1 });
    console.log("✅ Connected to MongoDB ping response:", serverStatus);
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message || error);
  }
})();
