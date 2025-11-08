import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb+srv://manyah2009:Chandan7200@cluster0.xxxxx.mongodb.net/AgriTrust";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected successfully to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
