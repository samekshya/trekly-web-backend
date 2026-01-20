import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5050",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

if (!env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
if (!env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");

