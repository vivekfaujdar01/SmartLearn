// Razorpay Configuration - Payment gateway setup
import Razorpay from 'razorpay'; // Razorpay SDK for payment processing
import dotenv from 'dotenv'; // Environment variable loader

dotenv.config(); // Load environment variables from .env file

/**
 * Initialize Razorpay instance with API credentials
 * Credentials are stored in environment variables for security
 * - RAZORPAY_KEY_ID: Public API key (can be exposed to frontend)
 * - RAZORPAY_KEY_SECRET: Private API secret (never expose to frontend!)
 */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Public key for order creation
    key_secret: process.env.RAZORPAY_KEY_SECRET // Secret key for verification
});

export default razorpay; // Export configured instance for use in controllers
