const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
  }
}

module.exports = connectDB;

