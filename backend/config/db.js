import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/call_crm";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.warn("⚠️ MongoDB is not connected yet (" + err.message + ").");
    console.warn("👉 To persist leads, provide a free MongoDB Atlas connection string in backend/.env (MONGO_URI=mongodb+srv://...) or run MongoDB locally.");
    console.log("ℹ️ Server running with in-memory AI mode active.");
  }
}
