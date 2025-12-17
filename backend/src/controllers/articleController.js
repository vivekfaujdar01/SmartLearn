import Article from '../models/Article.js';

// CREATE
export const createArticle = async (req, res) => {
  const article = await Article.create({
    title: req.body.title,
    content: req.body.content,
    thumbnailUrl: req.body.thumbnailUrl,
    category: req.body.category,
    tags: req.body.tags,
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
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
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
