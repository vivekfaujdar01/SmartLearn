// Course Routes - Handles CRUD endpoints for courses
// src/routes/courseRoutes.js
import express from 'express'; // Express framework for routing
import * as courseController from '../controllers/courseController.js'; // Course controller functions
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware
import requireRole from '../middlewares/roleMiddleware.js'; // Role-based authorization middleware

const router = express.Router(); // Create Express router instance

// ========== Public Routes ==========

// GET /api/courses - List all courses with optional filters (search, category, price)
router.get('/', courseController.listCourses);

// GET /api/courses/:id - Get single course details by ID
router.get('/:id', courseController.getCourseById);

// ========== Protected Routes (Instructor/Admin only) ==========

// POST /api/courses - Create a new course
// Requires authentication and instructor/admin role
router.post('/', auth, requireRole('instructor', 'admin'), courseController.createCourse);

// PUT /api/courses/:id - Update an existing course
// Requires authentication and instructor/admin role (controller checks ownership)
router.put('/:id', auth, requireRole('instructor', 'admin'), courseController.updateCourse);

// DELETE /api/courses/:id - Delete a course
// Requires authentication and instructor/admin role (controller checks ownership)
router.delete('/:id', auth, requireRole('instructor', 'admin'), courseController.deleteCourse);



export default router; // Export router for mounting in app.js
