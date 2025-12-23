import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
export const enrollUser = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
        return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
        user: userId,
        course: courseId
    });

    res.status(201).json({
        success: true,
        message: 'Enrolled successfully',
        enrollment
    });
});

// @desc    Check enrollment status
// @route   GET /api/enrollments/check/:courseId
// @access  Private
export const checkEnrollment = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

    res.json({
        isEnrolled: !!enrollment
    });
});

// @desc    Get my enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private
export const getMyEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user._id })
        .populate('course', 'title thumbnailUrl instructor shortDescription price')
        .sort('-enrolledAt');

    res.json({
        enrollments
    });
});
