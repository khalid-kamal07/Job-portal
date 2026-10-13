const mongoose = require("mongoose");
async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}
module.exports = connectDB;
