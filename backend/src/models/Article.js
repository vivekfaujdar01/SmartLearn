// Article Model - Database schema for blog articles
import mongoose from 'mongoose'; // MongoDB ODM for schema definition

/**
 * Article Schema definition for MongoDB
 * Represents blog posts/articles with author, likes, and view tracking
 */
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true // Automatically remove leading/trailing whitespace
  },
  content: {
    type: String,
    required: true // Article body content (can contain HTML from rich text editor)
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User who created the article
    required: true
  },
  category: {
    type: String,
    default: 'Development', // Default category if not specified
    index: true // Index for faster category-based queries
  },
  thumbnailUrl: {
    type: String // Optional URL to article thumbnail/cover image
  },
  tags: [{
    type: String // Array of string tags for categorization/search
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Array of User IDs who liked this article
  }],
  views: {
    type: Number,
    default: 0 // View counter, incremented when article is read
  },
  published: {
    type: Boolean,
    default: true // Whether article is visible to public
  },
  createdAt: {
    type: Date,
    default: Date.now // Article creation timestamp
  }
});

export default mongoose.model('Article', articleSchema); // Export Article model
