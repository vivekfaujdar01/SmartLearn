// Lesson Model - Database schema for course lessons/chapters
import mongoose from 'mongoose'; // MongoDB ODM for schema definition
import slugify from 'slugify'; // Library to create URL-friendly slugs

/**
 * Lesson Schema definition for MongoDB
 * Represents individual lessons within a course
 */
const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, // Lesson title (whitespace trimmed)
    slug: { type: String, required: true }, // URL-friendly identifier (auto-generated)
    content: { type: String }, // For text content, notes, or lesson description
    videoUrl: { type: String }, // URL to video resource (YouTube, Vimeo, etc.)
    duration: { type: Number, default: 0 }, // Lesson duration in minutes
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Parent course reference
    isFree: { type: Boolean, default: false }, // If true, lesson is available as free preview
    order: { type: Number, default: 0 }, // Lesson order within the course (for sorting)
    createdAt: { type: Date, default: Date.now } // Lesson creation timestamp
});

/**
 * Pre-validate middleware to generate slug before saving
 * Creates URL-friendly slug from title if not already set
 */
lessonSchema.pre('validate', function (next) {
    // Generate slug from title if not present
    if (!this.slug && this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model('Lesson', lessonSchema); // Export Lesson model
