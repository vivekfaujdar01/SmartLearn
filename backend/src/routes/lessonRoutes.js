import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import { createLesson, getLessonsByCourse, deleteLesson } from '../controllers/lessonController.js';

const router = express.Router();

// Public: Get lessons for a course (syllabus)
router.get('/course/:courseId', getLessonsByCourse);

// Protected: Add lesson (Instructor/Admin)
router.post(
    '/course/:courseId',
    auth,
    requireRole('instructor', 'admin'),
    createLesson
);

// Protected: Delete lesson
router.delete(
    '/:id',
    auth,
    requireRole('instructor', 'admin'),
    deleteLesson
);

export default router;
