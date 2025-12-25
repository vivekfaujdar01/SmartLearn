// Enrollment Model - Database schema for course enrollments
import mongoose from 'mongoose'; // MongoDB ODM for schema definition

/**
 * Enrollment Schema definition for MongoDB
 * Tracks which users are enrolled in which courses, including payment info
 * This creates a many-to-many relationship between Users and Courses
 */
const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the enrolled user
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the course enrolled in
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now // Timestamp of when enrollment was created
    },
    // Razorpay payment fields - stored for transaction records and refunds
    paymentId: {
        type: String,
        default: null // Razorpay payment ID (null for free courses)
    },
    orderId: {
        type: String,
        default: null // Razorpay order ID (null for free courses)
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'free'], // Possible payment states
        default: 'pending' // Initial status before payment completes
    }
});

/**
 * Compound unique index to prevent duplicate enrollments
 * A user can only enroll once in each course
 */
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema); // Export Enrollment model
