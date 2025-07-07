const mongoose = require('mongoose');

const username = 'whiteboard-user';
const password = 'uOOj1M633nY05UVY';
const db_url = `mongodb+srv://whiteboard-user:uOOj1M633nY05UVY@cluster0.kf5loy0.mongodb.net/white-board-app`;

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