// Authentication Routes - Handles user registration and login endpoints
import express from 'express'; // Express framework for routing
import { register, login } from '../controllers/auth.js'; // Controller functions for auth

const router = express.Router(); // Create Express router instance

// POST /api/auth/register - Create new user account
// Public route - no authentication required
router.post('/register', register);

// POST /api/auth/login - Authenticate user and return JWT token
// Public route - no authentication required
router.post('/login', login);

export default router; // Export router for mounting in app.js