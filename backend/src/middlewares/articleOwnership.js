import Article from '../models/Article.js';

export default async function articleOwnership(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // admin can do anything
    if (req.user.role === 'admin') {
      req.article = article;
      return next();
    }

    // owner check
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: not your article' });
    }

    req.article = article;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
