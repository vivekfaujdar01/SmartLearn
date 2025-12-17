// src/routes/courseRoutes.js
import express from 'express';
import * as courseController from '../controllers/courseController.js';
import auth from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public: list courses and get details by id
router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourseById);

// Protected: only instructors or admins can create / update / delete
router.post('/', auth, requireRole('instructor', 'admin'), courseController.createCourse);
router.put('/:id', auth, requireRole('instructor', 'admin'), courseController.updateCourse);
router.put('/:id', auth, requireRole('instructor', 'admin'), courseController.updateCourse);
router.delete('/:id', auth, requireRole('instructor', 'admin'), courseController.deleteCourse);



export default router;
