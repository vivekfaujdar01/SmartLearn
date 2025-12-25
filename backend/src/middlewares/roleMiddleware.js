// Role Middleware - Checks if authenticated user has required role
// src/middlewares/roleMiddleware.js

/**
 * requireRole(...allowedRoles)
 * Factory function that creates middleware to check user role
 * 
 * @param allowedRoles - Rest parameters of allowed role strings
 * @returns Middleware function that checks if user has one of the allowed roles
 * 
 * Usage: requireRole('instructor', 'admin')
 * Assumes `authMiddleware` ran earlier and set req.user
 */
export default function requireRole(...allowedRoles) {
  // Return the actual middleware function
  return (req, res, next) => {
    try {
      // Check if user exists on request (should be set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: no user found' });
      }

      // Check if user's role is in the allowed roles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' }); // 403 = Forbidden (authenticated but not authorized)
      }

      next(); // User has required role, continue to next middleware/controller
    } catch (err) {
      console.error('Role middleware error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
