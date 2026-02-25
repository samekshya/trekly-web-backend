import mongoose from "mongoose";
import "dotenv/config";
import { connectDB } from "../config/db";

// Set environment to test so db.ts uses MONGO_URI_TEST
process.env.NODE_ENV = "test";

// Connect to the test database before all tests run
beforeAll(async () => {
  await connectDB();
});

// Clear all collections after EACH test so they don't affect each other
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests finish
afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Cleans up the whole test DB
  await mongoose.connection.close();
});


// beforeAll(async () => {
//   // setup placeholder (we’ll connect test DB later if needed)
// });

// afterAll(async () => {
//   // teardown placeholder
// });
