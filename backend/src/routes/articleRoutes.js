// Article Routes - Handles CRUD endpoints for articles/blog posts
import express from 'express'; // Express framework for routing
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware
import requireRole from '../middlewares/roleMiddleware.js'; // Role-based authorization
import articleOwnership from '../middlewares/articleOwnership.js'; // Article ownership verification
import {
  createArticle,
  getAllArticles,
  getArticleById,
  getMyArticles,
  updateArticle,
  deleteArticle,
  toggleLike
} from '../controllers/articleController.js'; // Article controller functions

const router = express.Router(); // Create Express router instance

// ========== Public Routes ==========

// GET /api/articles - List all articles with optional filters (category, search)
router.get('/', getAllArticles);

// GET /api/articles/my/articles - Get articles created by current user
// Protected: requires authentication
router.get(
  '/my/articles',
  auth,
  requireRole('student', 'instructor', 'admin'),
  getMyArticles
);

// GET /api/articles/:id - Get single article by ID (also increments view count)
router.get('/:id', getArticleById);

// ========== Protected Routes ==========

// POST /api/articles - Create a new article
// Requires authentication - any logged-in user can create articles
router.post(
  '/',
  auth,
  requireRole('student', 'instructor', 'admin'),
  createArticle
);



// PUT /api/articles/:id - Update an existing article
// Requires authentication + ownership check (author or admin only)
router.put(
  '/:id',
  auth,
  requireRole('student', 'instructor', 'admin'),
  articleOwnership, // Verifies user owns the article or is admin
  updateArticle
);

// DELETE /api/articles/:id - Delete an article
// Requires authentication + ownership check (author or admin only)
router.delete(
  '/:id',
  auth,
  articleOwnership, // Verifies user owns the article or is admin
  deleteArticle
);

// POST /api/articles/:id/like - Toggle like on an article
// Requires authentication - any logged-in user can like/unlike
router.post(
  '/:id/like',
  auth,
  requireRole('student', 'instructor', 'admin'),
  toggleLike
);

export default router; // Export router for mounting in app.js
