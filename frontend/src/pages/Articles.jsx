import { useState, useEffect } from "react"; // React hooks for state management and side effects
import { fetchArticles, likeArticle, deleteArticle } from "../services/articleService"; // API functions for article operations
import { Link, useNavigate } from "react-router-dom"; // React Router components for navigation
import { 
  BookOpen, 
  Search, 
  Heart, 
  Filter,
  Trash2,
  Edit,
  Plus
} from "lucide-react"; // Icon library for UI elements
import { toast } from "sonner"; // Toast notification library

const categories = ["All", "Development", "Design", "Backend", "AI/ML", "Trends"]; // Available article categories for filtering

// Utility function to strip HTML tags from rich text content for display
const stripHtml = (html) => {
  if (!html) return ""; // Return empty string if no content
  const doc = new DOMParser().parseFromString(html, "text/html"); // Parse HTML string
  return doc.body.textContent || ""; // Extract plain text content
};

export default function Articles() {
  const [articles, setArticles] = useState([]); // State to store fetched articles
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [selectedCategory, setSelectedCategory] = useState("All"); // Currently selected category filter
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(""); // Error state for handling API errors

  const navigate = useNavigate(); // Hook for programmatic navigation
  const user = JSON.parse(localStorage.getItem("user")); // Get current user from localStorage
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const isAdmin = user?.role === "admin"; // Check if user is admin
  const canCreate = user && (user.role === 'student' || user.role === 'instructor' || user.role === 'admin'); // Check if user can create articles

  // Function to load articles from API with filters
  const loadArticles = async () => {
    setLoading(true); // Set loading state
    setError(""); // Clear previous errors
    try {
      const data = await fetchArticles(token, isAdmin, {
        category: selectedCategory, // Pass category filter
        search: searchQuery // Pass search query
      });
      setArticles(data); // Update articles state with fetched data
    } catch (err) {
      setError(err.message); // Set error message
      toast.error("Failed to load articles"); // Show error notification
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Effect to reload articles when category or auth state changes
  useEffect(() => {
    loadArticles();
  }, [selectedCategory, isAdmin, token]); 

  // Handler for search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form default behavior
    loadArticles(); // Fetch articles with current search query
  };

  // Handler for liking/unliking an article
  const handleLike = async (id) => {
    if (!user) {
      toast.error("Please login to like articles"); // Show error if not logged in
      return;
    }

    try {
      const { likes, isLiked } = await likeArticle(id, token); // Call like API
      setArticles(prev => prev.map(a => { // Update article's like count in state
        if (a._id === id) {
          return { ...a, likes };
        }
        return a;
      }));
      toast.success(isLiked ? "Article liked" : "Article unliked"); // Show success notification
    } catch (err) {
      toast.error(err.message); // Show error notification
    }
  };

  // Handler to delete an article after confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return; // Confirmation dialog
    try {
      await deleteArticle(id, token); // Call delete API
      setArticles(prev => prev.filter(a => a._id !== id)); // Remove article from state
      toast.success("Article deleted"); // Show success notification
    } catch (err) {
      toast.error(err.message); // Show error notification
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header section - currently empty placeholder */}


      {/* Hero section with search and create button */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <h1 className="text-5xl font-display font-bold mb-4">
          Discover Insights from Experts
        </h1>
        <p className="max-w-xl mx-auto mb-8 opacity-80">
          Learn from industry professionals through high-quality articles.
        </p>

        {/* Search form with icon */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> {/* Search icon */}
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 py-4 rounded-2xl bg-background text-foreground shadow-xl ring-1 ring-white/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
          />
        </form>

        {/* Create article button - visible only to authorized users */}
        {canCreate && (
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-semibold shadow-lg tilt-button glow-hover"
            onClick={() => navigate('/articles/create')}
          >
            <Plus className="w-5 h-5" /> Write Article
          </button>
        )}
      </section>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Filter className="text-muted-foreground" /> {/* Filter icon */}
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm tilt-button ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground" // Active category styling
                  : "border border-border text-muted-foreground" // Inactive category styling
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading and error state indicators */}
        {loading && <p className="text-center">Loading articles...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}

        {/* Article cards grid - responsive layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => {
            const isOwner = user && article.author && (user._id === article.author._id || user._id === article.author._id?.toString()); // Check if current user owns the article
            const canEdit = isAdmin || isOwner; // Admin or owner can edit/delete
            const isLiked = user && article.likes?.includes(user._id); // Check if user has liked this article

            return (
              <article
                key={article._id}
                className="group bg-card border border-border rounded-2xl shadow-card course-tilt overflow-hidden cursor-pointer"
                onClick={() => navigate(`/articles/${article._id}`)} // Navigate to article details on click
              >
                {/* Article thumbnail/image section */}
                <div className="h-48 gradient-hero relative">
                   {article.thumbnailUrl ? (
                     <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary-foreground/30" /> {/* Fallback icon */}
                     </div>
                   )}
                </div>

                {/* Article content section */}
                <div className="p-5">
                  <h3 className="font-display font-bold mb-2 text-xl line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                    {stripHtml(article.content)} {/* Display plain text excerpt */}
                  </p>

                  {/* Article footer with author info and action buttons */}
                  <div className="flex justify-between items-center border-t pt-4">
                    {/* Author avatar and name */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                          {article.author?.name?.[0] || "?"} {/* First letter of author name */}
                       </div>
                       <span>{article.author?.name || "Unknown"}</span>
                    </div>

                    {/* Action buttons: like, edit, delete */}
                    <div className="flex gap-2 items-center">
                      {/* Like button with count */}
                      <button 
                        onClick={() => handleLike(article._id)} 
                        className={`flex items-center gap-1 text-sm ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} /> {/* Filled heart if liked */}
                        {article.likes?.length || 0}
                      </button>

                      {/* Edit and delete buttons - visible only to admin/owner */}
                      {canEdit && (
                        <>
                           <button className="p-2 hover:bg-secondary rounded-full transition">
                             <Edit className="w-4 h-4 text-blue-500" />
                           </button>
                           <button onClick={() => handleDelete(article._id)} className="p-2 hover:bg-secondary rounded-full transition">
                             <Trash2 className="w-4 h-4 text-red-500" />
                           </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
