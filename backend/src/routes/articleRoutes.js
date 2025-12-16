import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import articleOwnership from '../middlewares/articleOwnership.js';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  getMyArticles,
  updateArticle,
  deleteArticle
} from '../controllers/articleController.js';

const router = express.Router();

// public
router.get('/', getAllArticles);
router.get('/:id', getArticleById);

// protected
router.post(
  '/',
  auth,
  requireRole('student', 'instructor', 'admin'),
  createArticle
);

router.get(
  '/my/articles',
  auth,
  requireRole('student', 'instructor', 'admin'),
  getMyArticles
);

router.put(
  '/:id',
  auth,
  requireRole('student', 'instructor', 'admin'),
  articleOwnership,
  updateArticle
);

router.delete(
  '/:id',
  auth,
  requireRole('student', 'instructor', 'admin'),
  articleOwnership,
  deleteArticle
);

export default router;
