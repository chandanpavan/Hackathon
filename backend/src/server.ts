import app from "./app";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
