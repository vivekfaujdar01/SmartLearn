// Course Model - Database schema for courses
// src/models/Course.js
import mongoose from 'mongoose'; // MongoDB ODM for schema definition
import slugify from 'slugify'; // Library to create URL-friendly slugs from titles

/**
 * Course Schema definition for MongoDB
 * Represents online courses with lessons, instructor, and pricing
 */
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // Course title (whitespace trimmed)
  slug: { type: String, required: true, unique: true }, // URL-friendly identifier (auto-generated from title)
  description: { type: String }, // Full course description (rich text)
  shortDescription: { type: String }, // Brief summary for course cards
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to instructor User document
  price: { type: Number, default: 0 }, // Course price in INR (0 = free)
  category: { type: String, index: true }, // Course category (indexed for faster queries)
  thumbnailUrl: { type: String }, // URL to course thumbnail image
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Array of references to Lesson documents
  published: { type: Boolean, default: false }, // Whether course is visible to students
  createdAt: { type: Date, default: Date.now } // Course creation timestamp
});

/**
 * Pre-validate middleware to generate slug before saving
 * Creates URL-friendly slug from title if not already set
 */
courseSchema.pre('validate', function (next) {
  // Generate slug from title if not present
  if (!this.slug && this.title) {
    // Create lowercase, strict slug (removes special chars) and limit to 200 chars
    this.slug = slugify(this.title, { lower: true, strict: true }).slice(0, 200);
  }
  next();
});

export default mongoose.model('Course', courseSchema); // Export Course model
