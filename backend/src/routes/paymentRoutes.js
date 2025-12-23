import express from 'express';
import { createOrder, verifyPayment, getKey } from '../controllers/paymentController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route - get Razorpay key
router.get('/key', getKey);

// Protected routes
router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);

export default router;
