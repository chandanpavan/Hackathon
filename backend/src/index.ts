import express from "express";
import  cors from "cors";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import recordRoutes from "./routes/record"; // ✅ correct backend import

const app = express();
const PORT = 5002;
const MONGO_URI = "mongodb+srv://manyah2009:Chandan7200@cluster0.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "agritrust";

app.use(cors({ origin: "http://localhost:5173" })); // frontend port
app.use(bodyParser.json());

// Connect MongoDB
let db: any;
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("✅ Connected to MongoDB");
    app.locals.db = db;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ✅ Route for records
app.use("/api/records", recordRoutes);
