import mongoose from 'mongoose';
import slugify from 'slugify';

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    content: { type: String }, // For text content or description
    videoUrl: { type: String }, // URL to video resource
    duration: { type: Number, default: 0 }, // in minutes
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isFree: { type: Boolean, default: false }, // Preview enabled?
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

lessonSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model('Lesson', lessonSchema);
