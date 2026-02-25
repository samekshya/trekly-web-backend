import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import authRoutes from "./modules/auth/auth.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";
import adminRoutes from "./modules/admin/admin.routes";
import trekRoutes from "./modules/trek/trek.routes";

const app = express();

// Middlewares (each one ONCE only)
app.use(express.json());
app.use(cookieParser());
app.use("/api/treks", trekRoutes);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Global error handler (keep last)
app.use(errorHandler);

export default app;
