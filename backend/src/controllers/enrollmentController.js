// Enrollment Controller - Handles course enrollment operations
import Enrollment from '../models/Enrollment.js'; // Enrollment model for database operations
import Course from '../models/Course.js'; // Course model for validation
import asyncHandler from '../middlewares/asyncHandler.js'; // Wrapper for async error handling

// @desc    Enroll in a course (direct enrollment without payment)
// @route   POST /api/enrollments
// @access  Private - requires authentication
// Note: For paid courses, use payment flow instead. This is for free courses or admin enrollment.
export const enrollUser = asyncHandler(async (req, res) => {
    const { courseId } = req.body; // Get course ID from request body
    const userId = req.user._id; // Get user ID from authenticated user

    // Verify course exists before attempting enrollment
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }


    // Check if user is already enrolled to prevent duplicate enrollments
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
        return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    // Create new enrollment record
    const enrollment = await Enrollment.create({
        user: userId,
        course: courseId
    });

    // Return success response with enrollment details
    res.status(201).json({
        success: true,
        message: 'Enrolled successfully',
        enrollment
    });
});

// @desc    Check if current user is enrolled in a specific course
// @route   GET /api/enrollments/check/:courseId
// @access  Private - requires authentication
// Used by frontend to determine whether to show "Enroll" or "Continue" button
export const checkEnrollment = asyncHandler(async (req, res) => {
    const { courseId } = req.params; // Get course ID from URL parameters
    const userId = req.user._id; // Get user ID from authenticated user

    // Check if enrollment record exists for this user-course combination
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

    // Return boolean indicating enrollment status
    res.json({
        isEnrolled: !!enrollment // Convert to boolean (true if enrollment exists, false otherwise)
    });
});

// @desc    Get all courses the current user is enrolled in
// @route   GET /api/enrollments/my-courses
// @access  Private - requires authentication
// Used for student dashboard to show enrolled courses
export const getMyEnrollments = asyncHandler(async (req, res) => {
    // Find all enrollments for the current user and populate course details
    const enrollments = await Enrollment.find({ user: req.user._id })
        .populate('course', 'title thumbnailUrl instructor shortDescription price') // Populate selected course fields
        .sort('-enrolledAt'); // Sort by enrollment date, newest first

    // Return enrollments array
    res.json({
        enrollments
    });
});
