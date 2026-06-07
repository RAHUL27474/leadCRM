import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/lead-crm";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
