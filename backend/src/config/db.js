// Database Configuration - MongoDB connection setup
import mongoose from 'mongoose'; // MongoDB ODM library

/**
 * Connect to MongoDB database
 * Uses MONGO_URI environment variable for connection string
 * @returns Promise that resolves when connected
 */
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI); // Connect using connection string from env
  console.log('MongoDB connected'); // Log success message
};

export default connectDB; // Export for use in server startup
