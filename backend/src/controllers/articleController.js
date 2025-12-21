import Article from '../models/Article.js';

// Helper function to escape special regex characters (prevent ReDoS)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// CREATE
export const createArticle = async (req, res) => {
  // Input validation
  const { title, content, thumbnailUrl, category, tags } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (title.length > 200) {
    return res.status(400).json({ message: 'Title must be less than 200 characters' });
  }

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content is required' });
  }

  if (content.length > 100000) {
    return res.status(400).json({ message: 'Content is too large (max 100,000 characters)' });
  }

  const article = await Article.create({
    title: title.trim(),
    content,
    thumbnailUrl,
    category,
    tags,
    author: req.user._id
  });

  res.status(201).json(article);
};

// READ ALL (public)
export const getAllArticles = async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    // Escape regex special characters to prevent ReDoS attacks
    const safeSearch = escapeRegex(search);
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { content: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  const articles = await Article.find(query)
    .populate('author', 'name role')
    .sort({ createdAt: -1 });

  res.json(articles);
};

// READ ONE (public)
export const getArticleById = async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name role');

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json(article);
};

// READ OWN
export const getMyArticles = async (req, res) => {
  const articles = await Article.find({ author: req.user._id })
    .sort({ createdAt: -1 });

  res.json(articles);
};

// UPDATE
export const updateArticle = async (req, res) => {
  const article = req.article;

  article.title = req.body.title ?? article.title;
  article.content = req.body.content ?? article.content;
  article.thumbnailUrl = req.body.thumbnailUrl ?? article.thumbnailUrl;
  article.category = req.body.category ?? article.category;
  article.tags = req.body.tags ?? article.tags;

  await article.save();
  res.json(article);
};

// DELETE
export const deleteArticle = async (req, res) => {
  await req.article.deleteOne();
  res.json({ message: 'Article deleted successfully' });
};

// TOGGLE LIKE
export const toggleLike = async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  const userId = req.user._id;
  const isLiked = article.likes.includes(userId);

  if (isLiked) {
    article.likes = article.likes.filter(id => id.toString() !== userId.toString());
  } else {
    article.likes.push(userId);
  }

  await article.save();
  res.json({ likes: article.likes, isLiked: !isLiked });
};

// ADMIN – LIST ALL (explicit admin route)
export const adminGetAllArticles = async (req, res) => {
  const articles = await Article.find()
    .populate('author', 'name email role')
    .sort({ createdAt: -1 });

  res.json(articles);
};
