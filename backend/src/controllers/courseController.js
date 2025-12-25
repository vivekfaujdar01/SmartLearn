// Course Controller - Handles CRUD operations for courses
// src/controllers/courseController.js
import Course from '../models/Course.js'; // Course model for database operations
import asyncHandler from '../middlewares/asyncHandler.js'; // Wrapper for async error handling
import mongoose from 'mongoose'; // MongoDB ODM for ObjectId validation

// Helper function to escape special regex characters (prevent ReDoS attacks)
// @param str - Input string to escape
// @returns String with special regex characters escaped
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Create a course
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private - only accessible to authenticated users with role 'instructor' or 'admin'
 * - sets `instructor` from req.user._id automatically
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, shortDescription, price = 0, category, thumbnailUrl } = req.body; // Extract course data

  // Basic validation - title is required
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Ensure auth middleware set req.user (should be done by protect middleware)
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Instructor is taken from the authenticated user (prevents impersonation)
  const instructor = req.user._id;

  // Create course document in database
  const course = await Course.create({
    title: title.trim(), // Trim whitespace from title
    description,
    shortDescription,
    price,
    category,
    thumbnailUrl,
    instructor
  });

  // Populate minimal instructor info for client convenience
  await course.populate('instructor', 'name email role');

  // Log for debugging (consider removing in production)
  console.log('Course created:', { id: course._id, instructor: course.instructor?.email || course.instructor });

  return res.status(201).json({ course }); // Return created course
});

/**
 * Update course
 * @desc    Update an existing course
 * @route   PUT /api/courses/:id
 * @access  Private - route protected by requireRole('instructor','admin')
 * - controller enforces that only the owning instructor or an admin can update
 * - only whitelisted fields will be updated to prevent mass assignment
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get course ID from URL params

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }

  const course = await Course.findById(id); // Find course in database
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // Authorization check: Only admin or owning instructor may update
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: not owner or admin' });
  }

  // Whitelist of updatable fields to avoid accidental overwrites (prevents mass assignment)
  const updatable = ['title', 'description', 'shortDescription', 'price', 'category', 'thumbnailUrl', 'published'];

  // Update only whitelisted fields that are present in request body
  updatable.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      course[field] = req.body[field];
    }
  });

  await course.save(); // Save updated course

  await course.populate('instructor', 'name email role'); // Populate instructor info

  res.json({ course }); // Return updated course
});

/**
 * Delete course
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private - route protected by requireRole('instructor','admin')
 * - controller enforces that only the owning instructor or an admin can delete
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get course ID from URL params

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }

  // Find course first to check ownership before deletion
  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check permissions: Admin or Owner only can delete
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this course' });
  }

  await course.deleteOne(); // Delete course from database

  return res.json({ message: 'Course removed successfully' });
});

/**
 * Get single course by id
 * @desc    Fetch a single course with details
 * @route   GET /api/courses/:id
 * @access  Public
 * - populates instructor info
 * - includes student count from enrollments
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get course ID from URL params

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }

  // Find course and populate instructor info (removed populate('lessons') as lessons are separate)
  const course = await Course.findById(id)
    .populate('instructor', 'name email role');

  // Calculate student count from Enrollment collection
  const studentCount = await mongoose.model('Enrollment').countDocuments({ course: id });

  // Return course with student count added
  res.json({ course: { ...course.toObject(), studentCount } });
});

/**
 * List courses
 * @desc    Get all courses with optional filtering and sorting
 * @route   GET /api/courses
 * @access  Public
 * - supports search (title / shortDescription)
 * - supports category filter
 * - supports price filter (free/paid)
 * - supports sorting via query params
 */
export const listCourses = asyncHandler(async (req, res) => {
  const { search = '', category, sort = 'createdAt:desc', price } = req.query; // Extract query params

  const query = {}; // Build MongoDB query object

  // Add search filter using regex (case-insensitive)
  if (search) {
    // Escape regex special characters to prevent ReDoS attacks
    const safeSearch = escapeRegex(search);
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } }, // Search in title
      { shortDescription: { $regex: safeSearch, $options: 'i' } } // Search in short description
    ];
  }

  // Add category filter if provided
  if (category) query.category = category;
  // Add price filter if provided
  if (price === 'free') query.price = 0; // Free courses have price = 0
  if (price === 'paid') query.price = { $gt: 0 }; // Paid courses have price > 0

  // Parse sort parameter (format: "field:direction", e.g., "createdAt:desc")
  const [sortField, sortDir] = sort.split(':');
  const sortObj = { [sortField || 'createdAt']: sortDir === 'asc' ? 1 : -1 };

  // Execute query with sorting and field selection
  const courses = await Course.find(query)
    .sort(sortObj)
    .select('title shortDescription price category thumbnailUrl instructor published createdAt')
    .populate('instructor', 'name'); // Only populate instructor name

  // Add student counts for each course (separate queries for count)
  const coursesWithCounts = await Promise.all(courses.map(async (course) => {
    const studentCount = await mongoose.model('Enrollment').countDocuments({ course: course._id });
    return { ...course.toObject(), studentCount };
  }));

  // Return total count and courses array
  res.json({
    total: courses.length,
    courses: coursesWithCounts
  });
});