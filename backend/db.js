const mongoose = require('mongoose');
require('dotenv').config();

const db_url = process.env.db_url;

const connectDB = async () => {
  try {
    await mongoose.connect(db_url);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Consider process.exit(1) for production if DB connection is critical
  }
};

module.exports = connectDB;