// Article Ownership Middleware - Verifies user owns the article or is admin
import Article from '../models/Article.js'; // Article model for database lookup

/**
 * Article Ownership Middleware
 * Checks if the requesting user is the author of the article or an admin
 * Attaches the article to req.article for use in subsequent handlers
 * 
 * @param req - Express request object (must have req.user from authMiddleware)
 * @param res - Express response object
 * @param next - Next middleware function
 * 
 * Usage: router.put('/:id', authMiddleware, articleOwnership, updateArticle)
 */
export default async function articleOwnership(req, res, next) {
  try {
    // Find article by ID from URL params
    const article = await Article.findById(req.params.id);

    // Return 404 if article doesn't exist
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Admin can do anything - skip ownership check
    if (req.user.role === 'admin') {
      req.article = article; // Attach article to request for controller use
      return next();
    }

    // Owner check - compare article author with current user ID
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: not your article' }); // 403 = Forbidden
    }

    // User is the owner - attach article and continue
    req.article = article;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
