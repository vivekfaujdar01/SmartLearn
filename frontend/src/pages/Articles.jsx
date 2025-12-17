import { useState, useEffect } from "react";
import { fetchArticles } from "../services/articleService";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  Clock, 
  Heart, 
  Bookmark,
  TrendingUp,
  Filter,
  ChevronRight
} from "lucide-react";

const categories = ["All", "Development", "Design", "Backend", "AI/ML", "Trends"];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedArticles, setLikedArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  /* ============================
     FETCH ARTICLES (LOGIC ONLY)
  ============================ */
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchArticles(token, isAdmin);

        // 🔁 Map backend → frontend shape (NO UI CHANGE)
        const mapped = data.map(a => ({
          id: a._id,
          title: a.title,
          excerpt: a.content.slice(0, 140) + "...",
          author: a.author?.name || "Unknown",
          avatar: a.author?.name
            ? a.author.name.split(" ").map(n => n[0]).join("")
            : "NA",
          category: "Development", // backend has no category yet
          readTime: `${Math.max(3, Math.ceil(a.content.length / 300))} min read`,
          likes: 0,
          comments: 0,
          date: new Date(a.createdAt).toLocaleDateString(),
          featured: false
        }));

        setArticles(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [isAdmin, token]);

  /* ============================
     FILTER LOGIC (UNCHANGED)
  ============================ */
  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  const toggleLike = (id) => {
    setLikedArticles(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSave = (id) => {
    setSavedArticles(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  /* ============================
     JSX BELOW = YOUR ORIGINAL UI
  ============================ */
  return (
    <div className="min-h-screen bg-background">
      {/* ===== HEADER / NAVBAR (UNCHANGED) ===== */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">SmartLearn</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link>
            <Link to="/articles" className="text-primary font-medium">Articles</Link>
            <Link to="/games" className="text-muted-foreground hover:text-foreground">Games</Link>
          </nav>

          <Link
            to="/login"
            className="px-4 py-2 gradient-primary text-primary-foreground rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ===== HERO (UNCHANGED) ===== */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <TrendingUp className="mx-auto mb-4" />
        <h1 className="text-5xl font-display font-bold mb-4">
          Discover Insights from Experts
        </h1>
        <p className="max-w-xl mx-auto mb-8 opacity-80">
          Learn from industry professionals through high-quality articles.
        </p>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 py-4 rounded-2xl bg-background text-foreground"
          />
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Filter className="text-muted-foreground" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
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

        {/* Articles Grid (UNCHANGED STRUCTURE) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map(article => (
            <article
              key={article.id}
              className="group bg-card border border-border rounded-2xl shadow-card hover:shadow-card-hover transition"
            >
              <div className="h-36 gradient-hero flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary-foreground/30" />
              </div>

              <div className="p-5">
                <h3 className="font-display font-bold mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {article.excerpt}
                </p>

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm">{article.author}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleLike(article.id)}>
                      <Heart className={`w-4 h-4 ${likedArticles.includes(article.id) ? "fill-current text-red-500" : ""}`} />
                    </button>
                    <button onClick={() => toggleSave(article.id)}>
                      <Bookmark className={`w-4 h-4 ${savedArticles.includes(article.id) ? "fill-current text-primary" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More (UI only) */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl">
            Load More Articles
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
