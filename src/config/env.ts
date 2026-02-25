import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5050",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
};

if (!env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
if (!env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");

if (!env.EMAIL_USER) throw new Error("EMAIL_USER is missing in .env");
if (!env.EMAIL_PASS) throw new Error("EMAIL_PASS is missing in .env");
if (!env.EMAIL_FROM) throw new Error("EMAIL_FROM is missing in .env");
// import dotenv from "dotenv";
// dotenv.config();

// export const env = {
//   PORT: process.env.PORT || "5050",
//   MONGO_URI: process.env.MONGO_URI || "",
//   JWT_SECRET: process.env.JWT_SECRET || "",
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
// };

// EMAIL_USER: process.env.EMAIL_USER || "",
// EMAIL_PASS: process.env.EMAIL_PASS || "",
// EMAIL_FROM: process.env.EMAIL_FROM || "",
// if (!env.EMAIL_USER) throw new Error("EMAIL_USER is missing in .env");
// if (!env.EMAIL_PASS) throw new Error("EMAIL_PASS is missing in .env");
// if (!env.EMAIL_FROM) throw new Error("EMAIL_FROM is missing in .env");

// if (!env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
// if (!env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");

