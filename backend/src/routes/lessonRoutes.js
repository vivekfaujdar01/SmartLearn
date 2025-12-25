// Lesson Routes - Handles CRUD endpoints for course lessons
import express from 'express'; // Express framework for routing
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware
import requireRole from '../middlewares/roleMiddleware.js'; // Role-based authorization
import { createLesson, getLessonsByCourse, deleteLesson } from '../controllers/lessonController.js'; // Lesson controller functions

const router = express.Router(); // Create Express router instance

// ========== Public Route ==========

// GET /api/lessons/course/:courseId - Get all lessons for a course (syllabus)
// Public: anyone can view lesson list (video content may be locked)
router.get('/course/:courseId', getLessonsByCourse);

// ========== Protected Routes (Instructor/Admin only) ==========

// POST /api/lessons/course/:courseId - Add a new lesson to a course
// Requires authentication and instructor/admin role
// Controller checks course ownership
router.post(
    '/course/:courseId',
    auth,
    requireRole('instructor', 'admin'),
    createLesson
);

// DELETE /api/lessons/:id - Delete a lesson
// Requires authentication and instructor/admin role
// Controller checks course ownership
router.delete(
    '/:id',
    auth,
    requireRole('instructor', 'admin'),
    deleteLesson
);

export default router; // Export router for mounting in app.js
