import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

// GET /api/users/me — get current user profile
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/users/me — update current user profile
router.put('/me', auth, asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Validate inputs
  if (!name && !email) {
    return res.status(400).json({ message: 'Provide at least one field to update (name or email)' });
  }

  if (name && name.trim().length === 0) {
    return res.status(400).json({ message: 'Name cannot be empty' });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if email already exists (if updating email)
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }
  }

  // Update user
  const updateData = {};
  if (name) updateData.name = name.trim();
  if (email) updateData.email = email.toLowerCase();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({ message: 'Profile updated successfully', user });
}));

// PUT /api/users/change-password — change user password (requires old password verification)
router.put('/change-password', auth, asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate inputs
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Please provide old password, new password, and confirm password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match' });
  }

  if (oldPassword === newPassword) {
    return res.status(400).json({ message: 'New password must be different from old password' });
  }

  // Fetch user with password field (normally excluded)
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify old password
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Old password is incorrect' });
  }

  // Update password
  user.password = newPassword;
  await user.save(); // pre-save hook will hash the password

  res.json({ message: 'Password changed successfully' });
}));
export default router;
