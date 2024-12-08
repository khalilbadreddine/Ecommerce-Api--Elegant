// dbConnection.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(DB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
