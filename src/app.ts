import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";


const app = express();

// Middlewares
//app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

app.post("/api/upload-debug", (_req, res) => {
  return res.status(200).json({ ok: true });
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);


// Global error handler (keep last)
app.use(errorHandler);

export default app;
