import express from 'express';
import { enrollUser, checkEnrollment, getMyEnrollments } from '../controllers/enrollmentController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(auth); // Protect all routes

router.post('/', enrollUser);
router.get('/check/:courseId', checkEnrollment);
router.get('/my-courses', getMyEnrollments);

export default router;
