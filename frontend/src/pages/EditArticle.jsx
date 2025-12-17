import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleById, updateArticle } from "../services/articleService";
import { toast } from "sonner";
import { ArrowLeft, Save, Image as ImageIcon, Tag, Layout, Loader2 } from "lucide-react";

const categories = ["Development", "Design", "Backend", "AI/ML", "Trends"];

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Development",
    thumbnailUrl: "",
    tags: ""
  });

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await getArticleById(id);
        setFormData({
            title: data.title,
            content: data.content,
            category: data.category || "Development",
            thumbnailUrl: data.thumbnailUrl || "",
            tags: data.tags ? data.tags.join(", ") : ""
        });
      } catch (err) {
        toast.error("Failed to load article");
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await updateArticle(id, {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim())
      }, token);
      
      toast.success("Article updated successfully!");
      navigate(`/articles/${id}`);
    } catch (err) {
      toast.error(err.message || "Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold">Edit Article</h1>
          <p className="text-muted-foreground">Update your content</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Article Title"
              className="w-full p-3 border rounded-xl bg-card"
              required
            />
          </div>

          {/* Category & Thumbnail */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Layout className="w-4 h-4 text-primary" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-card"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Thumbnail URL
              </label>
              <input
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full p-3 border rounded-xl bg-card"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Tags (comma separated)
            </label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, javascript, webdev"
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              placeholder="Write your article content here..."
              className="w-full p-3 border rounded-xl bg-card resize-y min-h-[300px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            {saving ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
