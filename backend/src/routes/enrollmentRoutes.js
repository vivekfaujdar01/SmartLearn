// Enrollment Routes - Handles course enrollment operations
import express from 'express'; // Express framework for routing
import { enrollUser, checkEnrollment, getMyEnrollments } from '../controllers/enrollmentController.js'; // Enrollment controller functions
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware

const router = express.Router(); // Create Express router instance

// All enrollment routes require authentication
router.use(auth); // Apply auth middleware to all routes in this router

// POST /api/enrollments - Enroll in a course (direct enrollment, no payment)
// Body: { courseId: string }
router.post('/', enrollUser);

// GET /api/enrollments/check/:courseId - Check if user is enrolled in a course
// Returns: { isEnrolled: boolean }
router.get('/check/:courseId', checkEnrollment);

// GET /api/enrollments/my-courses - Get all courses user is enrolled in
// Returns: { enrollments: [...] } with populated course data
router.get('/my-courses', getMyEnrollments);

export default router; // Export router for mounting in app.js
