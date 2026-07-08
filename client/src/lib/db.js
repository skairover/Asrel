import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

let isConnected = null;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  const db = await mongoose.connect(MONGODB_URI);
  isConnected = db.connections[0].readyState;
  return db;
  
}
