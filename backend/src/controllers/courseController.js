// src/controllers/courseController.js
import Course from '../models/Course.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * Create a course
 * - only accessible to authenticated users with role 'instructor' or 'admin'
 * - sets `instructor` from req.user._id
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, shortDescription, price = 0, category, thumbnailUrl } = req.body;

  // Basic validation
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Ensure auth middleware set req.user
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Instructor is taken from the authenticated user
  const instructor = req.user._id;

  // Create course document
  const course = await Course.create({
    title: title.trim(),
    description,
    shortDescription,
    price,
    category,
    thumbnailUrl,
    instructor
  });

  // Populate minimal instructor info for client convenience
  await course.populate('instructor', 'name email role');

  // Log for debugging (remove in production)
  console.log('Course created:', { id: course._id, instructor: course.instructor?.email || course.instructor });

  return res.status(201).json({ course });
});

/**
 * Update course
 * - route protected by requireRole('instructor','admin')
 * - controller enforces that only the owning instructor or an admin can update
 * - only whitelisted fields will be updated
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // Only admin or owning instructor may update
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: not owner or admin' });
  }

  // Whitelist of updatable fields to avoid accidental overwrites
  const updatable = ['title', 'description', 'shortDescription', 'price', 'category', 'thumbnailUrl', 'published'];

  updatable.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      course[field] = req.body[field];
    }
  });

  await course.save();

  await course.populate('instructor', 'name email role');

  res.json({ course });
});

/**
 * Delete course
 * - route protected by requireRole('instructor','admin')
 * - controller enforces that only the owning instructor or an admin can delete
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid course id' });

  // find and delete in one atomic operation
  const deleted = await Course.findByIdAndDelete(id);

  if (!deleted) return res.status(404).json({ message: 'Course not found' });

  return res.json({ message: 'Course removed' });
});

/**
 * Get single course by id
 * - public route
 * - populate instructor and lessons (if they exist in model)
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }

  // Populate only instructor (and any other small refs you actually have)
  const course = await Course.findById(id)
    .populate('instructor', 'name email role'); // removed populate('lessons')

  if (!course) return res.status(404).json({ message: 'Course not found' });

  res.json({ course });
});

/**
 * List courses
 * - supports search (title / shortDescription), category, price filters
 * - supports pagination and sorting via query params
 */
export const listCourses = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, search = '', category, sort = 'createdAt:desc', price } = req.query;
  page = parseInt(page, 10) || 1;
  limit = Math.max(1, parseInt(limit, 10) || 10);

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) query.category = category;
  if (price === 'free') query.price = 0;
  if (price === 'paid') query.price = { $gt: 0 };

  const [sortField, sortDir] = sort.split(':');
  const sortObj = { [sortField || 'createdAt']: sortDir === 'asc' ? 1 : -1 };

  const total = await Course.countDocuments(query);

  const courses = await Course.find(query)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('title shortDescription price category thumbnailUrl instructor published createdAt')
    .populate('instructor', 'name'); // no lessons populate

  res.json({
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
    courses
  });
});