import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  Bookmark,
  TrendingUp,
  Filter,
  ChevronRight
} from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Getting Started with React Hooks: A Complete Guide",
    excerpt: "Learn how to use React Hooks to manage state and side effects in your functional components...",
    author: "Sarah Johnson",
    avatar: "SJ",
    category: "Development",
    readTime: "8 min read",
    likes: 234,
    comments: 45,
    date: "Dec 12, 2024",
    featured: true
  },
  {
    id: 2,
    title: "UI/UX Design Principles Every Developer Should Know",
    excerpt: "Discover the fundamental design principles that will help you create better user experiences...",
    author: "Michael Chen",
    avatar: "MC",
    category: "Design",
    readTime: "6 min read",
    likes: 189,
    comments: 32,
    date: "Dec 10, 2024",
    featured: true
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js and Express",
    excerpt: "A comprehensive guide to building production-ready RESTful APIs that can handle millions of requests...",
    author: "Emily Davis",
    avatar: "ED",
    category: "Backend",
    readTime: "12 min read",
    likes: 312,
    comments: 67,
    date: "Dec 8, 2024",
    featured: false
  },
  {
    id: 4,
    title: "Mastering CSS Grid: From Basics to Advanced Layouts",
    excerpt: "Everything you need to know about CSS Grid to create complex, responsive layouts with ease...",
    author: "Alex Rivera",
    avatar: "AR",
    category: "Development",
    readTime: "10 min read",
    likes: 156,
    comments: 28,
    date: "Dec 6, 2024",
    featured: false
  },
  {
    id: 5,
    title: "Introduction to Machine Learning for Web Developers",
    excerpt: "Explore how machine learning can enhance your web applications with intelligent features...",
    author: "David Kim",
    avatar: "DK",
    category: "AI/ML",
    readTime: "15 min read",
    likes: 278,
    comments: 54,
    date: "Dec 4, 2024",
    featured: false
  },
  {
    id: 6,
    title: "The Future of Web Development: Trends to Watch in 2025",
    excerpt: "Stay ahead of the curve by learning about the emerging technologies and practices...",
    author: "Lisa Wang",
    avatar: "LW",
    category: "Trends",
    readTime: "7 min read",
    likes: 198,
    comments: 41,
    date: "Dec 2, 2024",
    featured: false
  }
];

const categories = ["All", "Development", "Design", "Backend", "AI/ML", "Trends"];

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedArticles, setLikedArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                LearnHub
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/articles" className="text-primary font-medium">Articles</Link>
              <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
              <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link 
                to="/signup" 
                className="px-4 py-2 gradient-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" />
              Explore Knowledge
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-primary-foreground mb-6">
              Discover Insights from
              <span className="block text-accent">Expert Writers</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Dive into articles written by industry professionals and passionate learners sharing their knowledge.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background border border-input rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Filter className="w-5 h-5 text-muted-foreground" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles.map(article => (
                <article 
                  key={article.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 gradient-hero relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary-foreground/30" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {article.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{article.author}</p>
                          <p className="text-xs text-muted-foreground">{article.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleLike(article.id)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            likedArticles.includes(article.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedArticles.includes(article.id) ? "fill-current" : ""}`} />
                          {article.likes + (likedArticles.includes(article.id) ? 1 : 0)}
                        </button>
                        <button 
                          onClick={() => toggleSave(article.id)}
                          className={`transition-colors ${
                            savedArticles.includes(article.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${savedArticles.includes(article.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {selectedCategory === "All" ? "All Articles" : selectedCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredArticles.length} articles
            </span>
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map(article => (
                <article 
                  key={article.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-36 gradient-hero opacity-80 relative flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary-foreground/30" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {article.avatar}
                        </div>
                        <span className="text-sm text-foreground">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleLike(article.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            likedArticles.includes(article.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedArticles.includes(article.id) ? "fill-current" : ""}`} />
                          {article.likes + (likedArticles.includes(article.id) ? 1 : 0)}
                        </button>
                        <button 
                          onClick={() => toggleSave(article.id)}
                          className={`transition-colors ${
                            savedArticles.includes(article.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${savedArticles.includes(article.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-card hover:border-primary/50 transition-all duration-200">
            Load More Articles
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 LearnHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
