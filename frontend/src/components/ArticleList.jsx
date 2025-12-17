import { Link } from "react-router-dom";
import { BookOpen, Heart, Calendar, Edit, Trash2 } from "lucide-react";
import { deleteArticle } from "../services/articleService";
import { toast } from "sonner";

export default function ArticleList({ articles, emptyMessage = "No articles found.", onDelete }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Prevent link navigation
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
        await deleteArticle(id, token);
        toast.success("Article deleted");
        if (onDelete) onDelete(id);
        else window.location.reload(); // Fallback if no callback
    } catch (err) {
        toast.error(err.message);
    }
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => {
        const isOwner = user && article.author && (user._id === article.author._id || user.id === article.author._id);
        const isAdmin = user?.role === 'admin';
        const canManage = isOwner || isAdmin;

        return (
        <div key={article._id} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition relative">
          <Link to={`/articles/${article._id}`} className="block">
            <div className="h-32 bg-muted relative">
                {article.thumbnailUrl ? (
                <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <BookOpen className="w-8 h-8" />
                </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-1 bg-background/80 backdrop-blur rounded text-[10px] font-bold">
                {article.category}
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-bold line-clamp-1 mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.likes?.length || 0}</span>
                </div>

                {canManage && (
                  <div className="flex gap-28 mt-2 pt-3 border-t border-border">
                      <Link 
                        to={`/articles/${article._id}/edit`} 
                        className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium text-center hover:bg-primary/20 transition flex items-center justify-center gap-2"
                      >
                           Edit
                      </Link>
                      <button 
                        onClick={(e) => handleDelete(e, article._id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                )}
            </div>
          </Link>
          
        </div>
      )})} 
    </div>
  );
}
