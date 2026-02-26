import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    // ✅ Use test DB when running Jest tests
    const uri = process.env.NODE_ENV === "test"
      ? (process.env.MONGO_URI_TEST as string)
      : env.MONGO_URI;

    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${uri}`);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

// import mongoose from "mongoose";
// import { env } from "./env";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection failed", error);
//     process.exit(1);
//   }
// };
