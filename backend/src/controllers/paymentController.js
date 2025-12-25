// Payment Controller - Handles Razorpay payment integration for course purchases
import crypto from 'crypto'; // Node.js crypto module for signature verification
import razorpay from '../config/razorpay.js'; // Configured Razorpay instance
import Enrollment from '../models/Enrollment.js'; // Enrollment model for database operations
import Course from '../models/Course.js'; // Course model for validation
import asyncHandler from '../middlewares/asyncHandler.js'; // Wrapper for async error handling

// @desc    Create Razorpay order for course enrollment
// @route   POST /api/payments/create-order
// @access  Private - requires authentication
// This initiates the payment process by creating an order on Razorpay
export const createOrder = asyncHandler(async (req, res) => {
    const { courseId } = req.body; // Get course ID from request body
    const userId = req.user._id; // Get user ID from authenticated user

    // Verify course exists before creating payment order
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled to prevent duplicate purchases
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // If free course, enroll directly without payment flow
    if (course.price === 0) {
        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
            paymentStatus: 'free' // Mark as free enrollment
        });

        return res.status(201).json({
            success: true,
            message: 'Enrolled successfully (Free Course)',
            enrollment,
            isFree: true // Flag for frontend to skip payment modal
        });
    }

    // Create Razorpay order for paid course
    // Receipt must be max 40 chars (Razorpay limit), so use shortened IDs
    const shortCourseId = courseId.toString().slice(-8);
    const shortUserId = userId.toString().slice(-8);
    const options = {
        amount: Math.round(course.price * 100), // Razorpay expects amount in paise (smallest currency unit)
        currency: 'INR', // Indian Rupees
        receipt: `rcpt_${shortCourseId}_${shortUserId}`, // Unique receipt identifier
        notes: { // Additional metadata stored with the order
            courseId: courseId.toString(),
            userId: userId.toString(),
            courseTitle: course.title
        }
    };

    try {
        // Create order on Razorpay servers
        const order = await razorpay.orders.create(options);

        // Return order details for frontend to initiate checkout
        res.status(200).json({
            success: true,
            order, // Razorpay order object
            course: { // Course details for display
                id: course._id,
                title: course.title,
                price: course.price
            },
            key: process.env.RAZORPAY_KEY_ID // Public key for frontend
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error.message || error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message || 'Unknown error'
        });
    }
});

// @desc    Verify Razorpay payment and complete enrollment
// @route   POST /api/payments/verify
// @access  Private - requires authentication
// This is called after successful payment on frontend to verify and complete enrollment
export const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id, // Order ID from Razorpay
        razorpay_payment_id, // Payment ID from Razorpay
        razorpay_signature, // Signature for verification
        courseId // Course being purchased
    } = req.body;
    const userId = req.user._id;

    // Verify payment signature using HMAC SHA256
    // This ensures the payment response is authentic and hasn't been tampered with
    const body = razorpay_order_id + '|' + razorpay_payment_id; // Concatenate order and payment IDs
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // Create HMAC with secret key
        .update(body.toString()) // Hash the concatenated string
        .digest('hex'); // Get hex digest

    const isAuthentic = expectedSignature === razorpay_signature; // Compare signatures

    // Reject if signature doesn't match (potential fraud attempt)
    if (!isAuthentic) {
        return res.status(400).json({
            success: false,
            message: 'Payment verification failed'
        });
    }

    // Check if already enrolled (prevent double enrollment from duplicate callbacks)
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
        return res.status(400).json({
            success: false,
            message: 'Already enrolled in this course'
        });
    }

    // Create enrollment with payment details for record keeping
    const enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        paymentId: razorpay_payment_id, // Store for reference/refunds
        orderId: razorpay_order_id, // Store for reference
        paymentStatus: 'completed' // Mark as paid enrollment
    });

    // Return success response
    res.status(201).json({
        success: true,
        message: 'Payment verified and enrolled successfully!',
        enrollment
    });
});

// @desc    Get Razorpay public key for frontend initialization
// @route   GET /api/payments/key
// @access  Public
// Frontend needs this to initialize Razorpay checkout
export const getKey = asyncHandler(async (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_KEY_ID // Only expose public key, never secret
    });
});
