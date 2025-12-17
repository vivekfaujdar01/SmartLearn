import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchArticles, likeArticle, deleteArticle } from "../services/articleService";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Heart, 
  Share2, 
  Edit, 
  Trash2,
  BookOpen
} from "lucide-react";

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        // We can reuse fetchArticles or need a specific getById. 
        // The service has a generic fetch, but backend has getArticleById. 
        // Let's check service again. Assuming getArticleById is separate or we use a direct fetch here if service is missing it.
        // Checking service... fetchArticles fetches all. I need to add getArticleById to service or use direct fetch. 
        // Wait, I saw getArticleById in backend controller. Let's see if it's in service.
        // If not, I'll add it. For now, I'll assume I need to add it or use direct fetch.
        // Actually, to be clean, I should add `getArticleById` to service. 
        // For this file generation, I will assume it exists or I will implement it here temporarily/add to service in next step.
        // Let's implement it in service in next step. usage: getArticleById(id)
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        setArticle(data);
      } catch (err) {
        toast.error("Failed to load article");
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }
    try {
      const { likes, isLiked } = await likeArticle(id, token);
      setArticle(prev => ({ ...prev, likes }));
      toast.success(isLiked ? "Liked!" : "Unliked");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await deleteArticle(id, token);
      toast.success("Article deleted");
      navigate("/articles");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!article) return null;

  const isOwner = user && article.author && (user._id === article.author._id || user._id === article.author._id?.toString());
  const isAdmin = user?.role === 'admin';
  const canEdit = isOwner || isAdmin;
  const isLiked = user && article.likes?.includes(user._id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link 
          to="/articles" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-full hover:bg-secondary transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>

      {/* Header Image */}
      <div className="h-[40vh] w-full relative bg-muted">
         {article.thumbnailUrl ? (
           <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full flex items-center justify-center gradient-hero">
             <BookOpen className="w-20 h-20 text-primary-foreground/20" />
           </div>
         )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 relative z-10">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category || "General"}
            </span>
            {article.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                 {article.author?.name?.[0] || "?"}
              </div>
              <div>
                <p className="font-semibold text-lg">{article.author?.name || "Unknown Author"}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> {Math.ceil(article.content.length / 1000)} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                  isLiked 
                    ? "bg-red-50 border-red-200 text-red-600" 
                    : "border-border hover:bg-secondary"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-medium">{article.likes?.length || 0}</span>
              </button>
              
              <button className="p-3 border border-border rounded-xl hover:bg-secondary transition">
                <Share2 className="w-5 h-5" />
              </button>

              {canEdit && (
                <>
                  <button 
                    onClick={() => navigate(`/articles/${id}/edit`)}
                    className="p-3 border border-blue-200 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-3 border border-red-200 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            {article.content.split('\n').map((paragraph, idx) => (
              paragraph ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
