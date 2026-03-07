import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import authRoutes from "./modules/auth/auth.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";
import trekRoutes from "./modules/trek/trek.routes";
import favouriteRoutes from "./modules/favourites/favourites.routes";
console.log("trekRoutes value:", trekRoutes); // ← ADD THIS
// src/app.ts




const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
}));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

// Routes (ALL routes together, after middlewares)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/treks", trekRoutes);   
app.use("/api/upload", uploadRoutes);

// Global error handler (always last)
app.use(errorHandler);

export default app;
