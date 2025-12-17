import Article from '../models/Article.js';

// CREATE
export const createArticle = async (req, res) => {
  const article = await Article.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
  });

  res.status(201).json(article);
};

// READ ALL (public)
export const getAllArticles = async (req, res) => {
  const articles = await Article.find()
    .populate('author', 'name role')
    .sort({ createdAt: -1 });

  res.json(articles);
};

// READ ONE (public)
export const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate('author', 'name role');

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

  await article.save();
  res.json(article);
};

// DELETE
export const deleteArticle = async (req, res) => {
  await req.article.deleteOne();
  res.json({ message: 'Article deleted successfully' });
};

// ADMIN – LIST ALL (explicit admin route)
export const adminGetAllArticles = async (req, res) => {
  const articles = await Article.find()
    .populate('author', 'name email role')
    .sort({ createdAt: -1 });

  res.json(articles);
};
