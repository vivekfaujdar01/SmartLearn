import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    // Razorpay payment fields
    paymentId: {
        type: String,
        default: null
    },
    orderId: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'free'],
        default: 'pending'
    }
});

// Prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
