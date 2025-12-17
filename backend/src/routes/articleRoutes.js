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
  deleteArticle,
  toggleLike
} from '../controllers/articleController.js';

const router = express.Router();

// public
router.get('/', getAllArticles);
router.get(
  '/my/articles',
  auth,
  requireRole('student', 'instructor', 'admin'),
  getMyArticles
);

router.get('/:id', getArticleById);

// protected
router.post(
  '/',
  auth,
  requireRole('student', 'instructor', 'admin'),
  createArticle
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
  articleOwnership,
  deleteArticle
);

// Toggle Like
router.post(
  '/:id/like',
  auth,
  requireRole('student', 'instructor', 'admin'),
  toggleLike
);

export default router;
