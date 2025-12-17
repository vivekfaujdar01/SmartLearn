// src/models/Course.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  shortDescription: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  category: { type: String, index: true },
  thumbnailUrl: { type: String },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// generate slug before save if not present or title changed
courseSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }).slice(0, 200);
  }
  next();
});

export default mongoose.model('Course', courseSchema);
