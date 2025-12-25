// Payment Routes - Handles Razorpay payment processing for course purchases
import express from 'express'; // Express framework for routing
import { createOrder, verifyPayment, getKey } from '../controllers/paymentController.js'; // Payment controller functions
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware

const router = express.Router(); // Create Express router instance

// ========== Public Route ==========

// GET /api/payments/key - Get Razorpay public key for frontend initialization
// Public: needed by frontend to initialize Razorpay checkout
router.get('/key', getKey);

// ========== Protected Routes ==========

// POST /api/payments/create-order - Create Razorpay order for course purchase
// Protected: requires authentication
// Body: { courseId: string }
// Returns: Razorpay order details or { isFree: true } for free courses
router.post('/create-order', auth, createOrder);

// POST /api/payments/verify - Verify payment and complete enrollment
// Protected: requires authentication
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId }
// Called after successful Razorpay checkout
router.post('/verify', auth, verifyPayment);

export default router; // Export router for mounting in app.js
