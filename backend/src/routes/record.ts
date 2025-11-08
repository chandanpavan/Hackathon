import { Router } from "express";
import { z } from "zod";
import { canonicalize } from "../utils/crypto"; // or just JSON.stringify sorted keys
import { insertRecord, findRecords, findByCid } from "../database/mongoQueries";
import { createHash } from "crypto";

const router = Router();

/**
 * Zod schema for validating record data
 */
const recordSchema = z.object({
  landId: z.string().min(1),
  cropType: z.string().min(1),
  soilMoisture: z.number().min(0).max(100),
  temperature: z.number().min(-100).max(100),
  phLevel: z.number().min(0).max(14).optional(),
  humidity: z.number().min(0).max(100).optional(),
  cid: z.string().min(3),
  producerId: z.string().min(1),
  hash: z.string().optional(),
});

/**
 * Generate SHA-256 hash of any object
 */
function generateHash(data: any): string {
  const canonical = JSON.stringify(data, Object.keys(data).sort());
  return createHash("sha256").update(canonical).digest("hex");
}

/**
 * POST /api/records
 * Save a new record (tamper-evident data)
 */
router.post("/", async (req, res, next) => {
  try {
    const input = recordSchema.parse(req.body);

    // Generate canonical string and hash
    const canonical = canonicalize({
      landId: input.landId,
      cropType: input.cropType,
      soilMoisture: input.soilMoisture,
      temperature: input.temperature,
      phLevel: input.phLevel,
      humidity: input.humidity,
      cid: input.cid,
      producerId: input.producerId,
      timestamp: new Date().toISOString(),
    });

    const contentHash = generateHash(canonical);

    // Store record in MongoDB
    await insertRecord({
      transaction_hash: contentHash,
      land_id: input.landId,
      farmer_address: input.producerId,
      timestamp: new Date(),
      soil_moisture: input.soilMoisture,
      temperature: input.temperature,
      cid: input.cid,
      status: "verified",
    } as any);

    console.log("✅ Record inserted:", contentHash);

    return res.status(201).json({
      success: true,
      hash: contentHash,
      canonical,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid record payload",
        details: error.issues,
      });
    }
    console.error("❌ Error saving record:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * GET /api/records?landId=...
 * List recent records (optionally filtered by landId)
 */
router.get("/", async (req, res, next) => {
  try {
    const landId = typeof req.query.landId === "string" ? req.query.landId : undefined;
    const rows = await findRecords(landId);

    const mapped = rows.map((r) => ({
      id: (r as any)._id,
      hash: r.transaction_hash,
      landId: r.land_id,
      producerId: r.farmer_address,
      timestamp: r.timestamp,
      soilMoisture: r.soil_moisture,
      temperature: r.temperature,
      cid: r.cid,
      status: r.status,
    }));

    return res.json({ success: true, records: mapped });
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    return res.status(500).json({ success: false, message: "Database fetch failed" });
  }
});

/**
 * GET /api/records/verify?cid=<value>
 * Verify a record's data integrity
 */
router.get("/verify", async (req, res, next) => {
  try {
    const cid = z.string().min(1).parse(req.query.cid);
    const record = await findByCid(cid);

    if (!record) {
      return res.status(404).json({ ok: false, message: "Record not found" });
    }

    const canonical = canonicalize({
      landId: record.land_id,
      soilMoisture: record.soil_moisture,
      temperature: record.temperature,
      cid: record.cid,
      producerId: record.farmer_address,
      timestamp: record.timestamp.toISOString(),
    });

    const recomputedHash = generateHash(canonical);
    const valid = recomputedHash === record.transaction_hash;

    return res.json({
      ok: valid,
      storedHash: record.transaction_hash,
      recomputedHash,
      canonical,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, message: "Invalid CID format" });
    }
    console.error("❌ Verification error:", error);
    return res.status(500).json({ ok: false, message: "Verification failed" });
  }
});

export default router;
