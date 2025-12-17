import { useState, useEffect } from "react";
import { fetchArticles } from "../services/articleService";
import { toast } from "sonner";
import { Shield, BookOpen, Trash2, Edit, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }

    const loadArticles = async () => {
      try {
        const data = await fetchArticles(token, true); // true = isAdmin
        
        // Map data if needed (similar to Articles.jsx)
        const mapped = data.map((a) => ({
          id: a._id,
          title: a.title,
          author: a.author?.name || "Unknown",
          date: new Date(a.createdAt).toLocaleDateString(),
        }));

        setArticles(mapped);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform content</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                All Articles ({articles.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Author</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-muted/30 transition">
                      <td className="p-4 font-medium">{article.title}</td>
                      <td className="p-4 text-muted-foreground">{article.author}</td>
                      <td className="p-4 text-muted-foreground">{article.date}</td>
                      <td className="p-4 text-right">
                        <button 
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                          onClick={() => toast.info("Delete feature coming soon")}
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
