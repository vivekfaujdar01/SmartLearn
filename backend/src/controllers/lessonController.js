import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import mongoose from 'mongoose';

// CREATE LESSON
export const createLesson = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, content, videoUrl, duration, isFree } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Invalid course id' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    const lesson = await Lesson.create({
        title,
        content,
        videoUrl,
        duration,
        isFree,
        course: courseId,
        order: course.lessons.length + 1 // simple ordering
    });

    // Push lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
});

// GET LESSONS BY COURSE (Public or Protected depending on logic, let's make it public for listing syllabus)
export const getLessonsByCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ course: courseId }).sort('order');
    res.json({ lessons });
});

// DELETE LESSON
export const deleteLesson = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    await lesson.deleteOne();

    // Remove from course array
    course.lessons = course.lessons.filter(l => l.toString() !== id);
    await course.save();

    res.json({ message: 'Lesson deleted' });
});
