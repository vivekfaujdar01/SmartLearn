// Lesson Controller - Handles CRUD operations for course lessons
import Lesson from '../models/Lesson.js'; // Lesson model for database operations
import Course from '../models/Course.js'; // Course model for validation and updates
import asyncHandler from '../middlewares/asyncHandler.js'; // Wrapper for async error handling
import mongoose from 'mongoose'; // MongoDB ODM for ObjectId validation

// CREATE LESSON - Add a new lesson to a course
// @desc    Create a new lesson for a specific course
// @route   POST /api/lessons/course/:courseId
// @access  Private - instructor (owner) or admin only
export const createLesson = asyncHandler(async (req, res) => {
    const { courseId } = req.params; // Get course ID from URL parameters
    const { title, content, videoUrl, duration, isFree } = req.body; // Extract lesson data

    // Validate MongoDB ObjectId format to prevent errors
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Invalid course id' });
    }

    // Verify course exists before adding lesson
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Authorization check: Only admin or course owner can add lessons
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    // Create lesson document with auto-calculated order
    const lesson = await Lesson.create({
        title,
        content,
        videoUrl,
        duration,
        isFree, // If true, this lesson is available as free preview
        course: courseId,
        order: course.lessons.length + 1 // Simple ordering based on current lesson count
    });

    // Push lesson reference to course's lessons array
    course.lessons.push(lesson._id);
    await course.save(); // Save course with new lesson reference

    res.status(201).json(lesson); // Return created lesson
});

// GET LESSONS BY COURSE - Fetch all lessons for a course
// @desc    Get all lessons for a specific course (for syllabus display)
// @route   GET /api/lessons/course/:courseId
// @access  Public - anyone can see lesson list (content may be locked)
export const getLessonsByCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params; // Get course ID from URL parameters

    // Find all lessons for the course, sorted by order field
    const lessons = await Lesson.find({ course: courseId }).sort('order');

    res.json({ lessons }); // Return lessons array
});

// DELETE LESSON - Remove a lesson from a course
// @desc    Delete a specific lesson
// @route   DELETE /api/lessons/:id
// @access  Private - instructor (owner) or admin only
export const deleteLesson = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get lesson ID from URL parameters

    // Find lesson by ID
    const lesson = await Lesson.findById(id);

    if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
    }

    // Find the parent course to check ownership
    const course = await Course.findById(lesson.course);

    // Authorization check: Only admin or course owner can delete lessons
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    await lesson.deleteOne(); // Delete lesson from database

    // Remove lesson reference from course's lessons array to maintain consistency
    course.lessons = course.lessons.filter(l => l.toString() !== id);
    await course.save(); // Save course with lesson removed

    res.json({ message: 'Lesson deleted' }); // Return confirmation
});
