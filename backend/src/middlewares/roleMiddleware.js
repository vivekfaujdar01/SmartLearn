// src/middlewares/roleMiddleware.js

/**
 * requireRole(...allowedRoles)
 * - Usage: requireRole('instructor', 'admin')
 * - Assumes `auth` middleware ran earlier and set req.user
 */
export default function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: no user found' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
