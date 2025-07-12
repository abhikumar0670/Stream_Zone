const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in environment variables');
    console.log('🔧 Please set MONGODB_URI in your .env file');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('🔧 Please ensure:');
    console.log('   1. Your IP address is whitelisted in MongoDB Atlas');
    console.log('   2. Your MongoDB Atlas cluster is running');
    console.log('   3. Your connection string is correct');
    console.log('🚀 Server will continue running without database connection');
    // Don't exit the process, just log the error
  }
};

module.exports = connectDB;
