// Authentication Middleware - Verifies JWT tokens and attaches user to request
// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken'; // JWT library for token verification
import User from '../models/User.js'; // User model to fetch user data

/**
 * Auth Middleware - Protects routes requiring authentication
 * Extracts JWT from Authorization header, verifies it, and attaches user to request
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export default async function authMiddleware(req, res, next) {
  try {
    // Extract Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization || '';

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract the token part after "Bearer "
    const token = authHeader.split(' ')[1];

    // Verify token using JWT secret - throws error if invalid or expired
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database using ID from token payload (excludes password)
    const user = await User.findById(payload.id).select('-password');

    // Check if user still exists (could have been deleted after token was issued)
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user to request object for use in subsequent middleware/controllers
    req.user = user;
    next(); // Continue to next middleware
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
