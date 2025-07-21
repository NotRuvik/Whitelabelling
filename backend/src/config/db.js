const mongoose = require("mongoose");
require("dotenv").config();
const config = require("./config"); // <-- Import config

const connectDB = async () => {
  try {
    // Use the config object
    const conn = await mongoose.connect(config.mongoose.url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;