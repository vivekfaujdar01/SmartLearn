import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Create Razorpay order for course enrollment
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // If free course, enroll directly
    if (course.price === 0) {
        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
            paymentStatus: 'free'
        });

        return res.status(201).json({
            success: true,
            message: 'Enrolled successfully (Free Course)',
            enrollment,
            isFree: true
        });
    }

    // Create Razorpay order for paid course
    // Receipt must be max 40 chars, so use shortened IDs
    const shortCourseId = courseId.toString().slice(-8);
    const shortUserId = userId.toString().slice(-8);
    const options = {
        amount: Math.round(course.price * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `rcpt_${shortCourseId}_${shortUserId}`,
        notes: {
            courseId: courseId.toString(),
            userId: userId.toString(),
            courseTitle: course.title
        }
    };

    try {
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            course: {
                id: course._id,
                title: course.title,
                price: course.price
            },
            key: process.env.RAZORPAY_KEY_ID
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
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        courseId
    } = req.body;
    const userId = req.user._id;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        return res.status(400).json({
            success: false,
            message: 'Payment verification failed'
        });
    }

    // Check if already enrolled (prevent double enrollment)
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
        return res.status(400).json({
            success: false,
            message: 'Already enrolled in this course'
        });
    }

    // Create enrollment with payment details
    const enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentStatus: 'completed'
    });

    res.status(201).json({
        success: true,
        message: 'Payment verified and enrolled successfully!',
        enrollment
    });
});

// @desc    Get Razorpay key for frontend
// @route   GET /api/payments/key
// @access  Public
export const getKey = asyncHandler(async (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_KEY_ID
    });
});
