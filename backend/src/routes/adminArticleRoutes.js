// Admin Article Routes - Admin-only endpoints for article management
import express from 'express'; // Express framework for routing
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware
import requireRole from '../middlewares/roleMiddleware.js'; // Role-based authorization
import { adminGetAllArticles } from '../controllers/articleController.js'; // Admin article controller function

const router = express.Router(); // Create Express router instance

// GET /api/admin/articles - Get all articles for admin management
// Protected: admin role only
// Returns all articles including author email for admin review
router.get(
  '/articles',
  auth, // Verify user is authenticated
  requireRole('admin'), // Verify user has admin role
  adminGetAllArticles
);

export default router; // Export router for mounting in app.js
