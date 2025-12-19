import { useState, useEffect } from "react";
import { fetchArticles, likeArticle, deleteArticle } from "../services/articleService";
import { Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  Heart, 
  Filter,
  Trash2,
  Edit,
  Plus
} from "lucide-react";
import { toast } from "sonner";

const categories = ["All", "Development", "Design", "Backend", "AI/ML", "Trends"];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";
  const canCreate = user && (user.role === 'student' || user.role === 'instructor' || user.role === 'admin');

  const loadArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchArticles(token, isAdmin, {
        category: selectedCategory,
        search: searchQuery
      });
      setArticles(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, isAdmin, token]); 

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const handleLike = async (id) => {
    if (!user) {
      toast.error("Please login to like articles");
      return;
    }

    try {
      const { likes, isLiked } = await likeArticle(id, token);
      setArticles(prev => prev.map(a => {
        if (a._id === id) {
          return { ...a, likes };
        }
        return a;
      }));
      toast.success(isLiked ? "Article liked" : "Article unliked");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle(id, token);
      setArticles(prev => prev.filter(a => a._id !== id));
      toast.success("Article deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}


      {/* Hero */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <h1 className="text-5xl font-display font-bold mb-4">
          Discover Insights from Experts
        </h1>
        <p className="max-w-xl mx-auto mb-8 opacity-80">
          Learn from industry professionals through high-quality articles.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 py-4 rounded-2xl bg-background text-foreground shadow-xl ring-1 ring-white/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
          />
        </form>

        {canCreate && (
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-semibold shadow-lg tilt-button glow-hover"
            onClick={() => navigate('/articles/create')}
          >
            <Plus className="w-5 h-5" /> Write Article
          </button>
        )}
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Filter className="text-muted-foreground" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm tilt-button ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="text-center">Loading articles...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => {
            const isOwner = user && article.author && (user._id === article.author._id || user._id === article.author._id?.toString());
            const canEdit = isAdmin || isOwner;
            const isLiked = user && article.likes?.includes(user._id);

            return (
              <article
                key={article._id}
                className="group bg-card border border-border rounded-2xl shadow-card course-tilt overflow-hidden cursor-pointer"
                onClick={() => navigate(`/articles/${article._id}`)}
              >
                <div className="h-48 gradient-hero relative">
                   {article.thumbnailUrl ? (
                     <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary-foreground/30" />
                     </div>
                   )}
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold mb-2 text-xl line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                          {article.author?.name?.[0] || "?"}
                       </div>
                       <span>{article.author?.name || "Unknown"}</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button 
                        onClick={() => handleLike(article._id)} 
                        className={`flex items-center gap-1 text-sm ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                        {article.likes?.length || 0}
                      </button>

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
