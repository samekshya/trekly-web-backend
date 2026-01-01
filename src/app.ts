import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

// Routes
app.use("/api/auth", authRoutes);

// Global error handler (keep last)
app.use(errorHandler);

export default app;
