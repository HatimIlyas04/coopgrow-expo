import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import standsRoutes from "./routes/stands.routes.js";
import productsRoutes from "./routes/products.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// ✅ Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stands", standsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => res.send("CoopGrow Expo API ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
