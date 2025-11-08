import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { connectMongo } from "./database/mongo"; // ✅ MongoDB connection

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import authRouter from "./routes/auth";
import landRouter from "./routes/land";
import recordsRouter from "./routes/record";
import { notFound, errorHandler } from "./middleware/errorhandler";

const app = express();

const CLIENT_ORIGINS = process.env.CLIENT_ORIGINS?.split(",") || ["*"];
const NODE_ENV = process.env.NODE_ENV || "development";

const corsOptions: CorsOptions = {
  origin: CLIENT_ORIGINS,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: "connected" });
});

app.use("/api/auth", authRouter);
app.use("/api/land", landRouter);
app.use("/api/records", recordsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
