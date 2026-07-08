import mongoose from "mongoose";

export default async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env file");
  }

  try {
    console.log("Trying MongoDB connection...");

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
}