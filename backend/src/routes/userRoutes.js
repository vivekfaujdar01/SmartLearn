// User Routes - Handles user profile operations
import express from 'express'; // Express framework for routing
import auth from '../middlewares/authMiddleware.js'; // Authentication middleware
import User from '../models/User.js'; // User model for database operations
import asyncHandler from '../middlewares/asyncHandler.js'; // Async error handler wrapper

const router = express.Router(); // Create Express router instance

// GET /api/users/me — Get current user profile
// Protected: requires authentication
// Returns the user object attached to request by authMiddleware
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user }); // Return user from req (set by auth middleware)
});

// PUT /api/users/me — Update current user profile (name and/or email)
// Protected: requires authentication
router.put('/me', auth, asyncHandler(async (req, res) => {
  const { name, email } = req.body; // Extract fields to update

  // Validate inputs - at least one field must be provided
  if (!name && !email) {
    return res.status(400).json({ message: 'Provide at least one field to update (name or email)' });
  }

  // Validate name is not empty if provided
  if (name && name.trim().length === 0) {
    return res.status(400).json({ message: 'Name cannot be empty' });
  }

  // Validate email format using regex if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if new email already exists for a different user
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' }); // 409 Conflict
    }
  }

  // Build update object with only provided fields
  const updateData = {};
  if (name) updateData.name = name.trim();
  if (email) updateData.email = email.toLowerCase();

  // Update user and return new document (excludes password)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true } // Return updated doc and run schema validators
  ).select('-password');

  res.json({ message: 'Profile updated successfully', user });
}));

// PUT /api/users/change-password — Change user password
// Protected: requires authentication and old password verification
router.put('/change-password', auth, asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate all required fields are provided
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Please provide old password, new password, and confirm password' });
  }

  // Validate minimum password length
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  // Strong password policy: require uppercase, lowercase, and number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    });
  }

  // Verify passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match' });
  }

  // Prevent using same password
  if (oldPassword === newPassword) {
    return res.status(400).json({ message: 'New password must be different from old password' });
  }

  // Fetch user with password field (normally excluded for security)
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify old password is correct
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Old password is incorrect' });
  }

  // Update password (pre-save hook will hash it automatically)
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
}));

export default router; // Export router for mounting in app.js
