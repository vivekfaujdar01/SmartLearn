import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import { adminGetAllArticles } from '../controllers/articleController.js';

const router = express.Router();

router.get(
  '/articles',
  auth,
  requireRole('admin'),
  adminGetAllArticles
);

export default router;
