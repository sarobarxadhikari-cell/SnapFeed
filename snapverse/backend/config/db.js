import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snapverse";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[Snapverse] MongoDB connected");
  } catch (err) {
    console.error("[Snapverse] DB connection error:", err.message);
    process.exit(1);
  }
}
