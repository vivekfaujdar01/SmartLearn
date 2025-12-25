// Article Controller - Handles CRUD operations for articles
import Article from '../models/Article.js'; // Article model for database operations

// Helper function to escape special regex characters (prevent ReDoS attacks)
// ReDoS = Regular Expression Denial of Service - prevents malicious input from causing performance issues
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// CREATE - Add a new article
// @desc    Create a new article
// @route   POST /api/articles
// @access  Private - requires authentication
export const createArticle = async (req, res) => {
  // Input validation - extract and validate required fields
  const { title, content, thumbnailUrl, category, tags } = req.body;

  // Title is required and cannot be empty
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Limit title length for database and UI consistency
  if (title.length > 200) {
    return res.status(400).json({ message: 'Title must be less than 200 characters' });
  }

  // Content is required and cannot be empty
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content is required' });
  }

  // Limit content size to prevent abuse (100KB max)
  if (content.length > 100000) {
    return res.status(400).json({ message: 'Content is too large (max 100,000 characters)' });
  }

  // Create article document with author set from authenticated user
  const article = await Article.create({
    title: title.trim(),
    content,
    thumbnailUrl,
    category,
    tags,
    author: req.user._id // Set author from authenticated user
  });

  res.status(201).json(article); // Return created article
};

// READ ALL (public) - Get all articles with optional filtering
// @desc    Get all articles with optional category and search filters
// @route   GET /api/articles
// @access  Public
export const getAllArticles = async (req, res) => {
  const { category, search } = req.query; // Extract filter params from query string
  const query = {}; // Build MongoDB query object

  // Add category filter if provided and not "All"
  if (category && category !== 'All') {
    query.category = category;
  }

  // Add search filter using regex for title and content
  if (search) {
    // Escape regex special characters to prevent ReDoS attacks
    const safeSearch = escapeRegex(search);
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } }, // Case-insensitive title search
      { content: { $regex: safeSearch, $options: 'i' } } // Case-insensitive content search
    ];
  }

  // Execute query with author population and newest-first sorting
  const articles = await Article.find(query)
    .populate('author', 'name role') // Populate author name and role only
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  res.json(articles); // Return articles array
};

// READ ONE (public) - Get single article by ID
// @desc    Get a single article by ID and increment view count
// @route   GET /api/articles/:id
// @access  Public
export const getArticleById = async (req, res) => {
  // Find article by ID and increment views counter atomically
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } }, // Increment views by 1
    { new: true } // Return updated document
  ).populate('author', 'name role');

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json(article); // Return article with incremented view count
};

// READ OWN - Get articles created by current user
// @desc    Get all articles authored by the authenticated user
// @route   GET /api/articles/my
// @access  Private
export const getMyArticles = async (req, res) => {
  // Find all articles where author matches current user
  const articles = await Article.find({ author: req.user._id })
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  res.json(articles); // Return user's articles
};

// UPDATE - Edit an existing article
// @desc    Update an article (ownership checked by middleware)
// @route   PUT /api/articles/:id
// @access  Private (owner or admin only - enforced by middleware)
export const updateArticle = async (req, res) => {
  const article = req.article; // Article is attached to request by ownership middleware

  // Update fields if provided in request body, otherwise keep existing values
  article.title = req.body.title ?? article.title;
  article.content = req.body.content ?? article.content;
  article.thumbnailUrl = req.body.thumbnailUrl ?? article.thumbnailUrl;
  article.category = req.body.category ?? article.category;
  article.tags = req.body.tags ?? article.tags;

  await article.save(); // Save updated article to database
  res.json(article); // Return updated article
};

// DELETE - Remove an article
// @desc    Delete an article (ownership checked by middleware)
// @route   DELETE /api/articles/:id
// @access  Private (owner or admin only - enforced by middleware)
export const deleteArticle = async (req, res) => {
  await req.article.deleteOne(); // Delete article from database
  res.json({ message: 'Article deleted successfully' }); // Return confirmation
};

// TOGGLE LIKE - Like or unlike an article
// @desc    Toggle like status on an article for the current user
// @route   POST /api/articles/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  const article = await Article.findById(req.params.id); // Find article by ID

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  const userId = req.user._id;
  const isLiked = article.likes.includes(userId); // Check if user already liked

  if (isLiked) {
    // User already liked - remove like (unlike)
    article.likes = article.likes.filter(id => id.toString() !== userId.toString());
  } else {
    // User hasn't liked - add like
    article.likes.push(userId);
  }

  await article.save(); // Save updated likes array
  res.json({ likes: article.likes, isLiked: !isLiked }); // Return new likes array and toggle status
};

// ADMIN – LIST ALL (explicit admin route)
// @desc    Get all articles including unpublished (for admin management)
// @route   GET /api/admin/articles
// @access  Private (admin only)
export const adminGetAllArticles = async (req, res) => {
  // Find all articles with full author info for admin review
  const articles = await Article.find()
    .populate('author', 'name email role') // Include email for admin
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  res.json(articles); // Return all articles
};
