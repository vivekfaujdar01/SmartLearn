// Server Entry Point - Application startup and initialization
import dotenv from 'dotenv'; // Environment variable management
import app from './app.js'; // Express application instance
import connectDB from './config/db.js'; // Database connection function

// Load environment variables from .env file into process.env
dotenv.config({
  path: "./.env" // Path to environment file
});

// Get port from environment or use default 3000
const PORT = process.env.PORT || 3000;

// Initialize application: Connect to database first, then start server
connectDB().then(() => {
  // Start Express server listening on specified port
  app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));
});