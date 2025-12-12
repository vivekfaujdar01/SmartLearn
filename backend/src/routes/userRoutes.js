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

export default router;
