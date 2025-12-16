import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Play,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { listCourses } from "../services/courseService";

const categories = ["All", "backend", "frontend", "design", "business", "marketing"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Auth user (standard MERN)
  const user = JSON.parse(localStorage.getItem("user"));
  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCourses({
        page: currentPage,
        limit: 9,
        search: searchQuery,
        category: selectedCategory === "All" ? "" : selectedCategory
      });

      setCourses(data.courses || []);
      setMeta(data.meta || {});
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= meta.pages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">SmartLearn</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/courses" className="text-primary font-medium">Courses</Link>
            <Link to="/articles" className="text-muted-foreground hover:text-foreground">Articles</Link>
            <Link to="/games" className="text-muted-foreground hover:text-foreground">Games</Link>
          </nav>

          <div className="flex gap-3">
            {isInstructor && (
              <Link
                to="/instructor/add-course"
                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-card"
              >
                Add Course
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                className="px-4 py-2 gradient-primary text-primary-foreground rounded-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <Sparkles className="mx-auto mb-4" />
        <h1 className="text-5xl font-display font-bold mb-4">
          Learn From Expert Instructors
        </h1>
        <p className="max-w-xl mx-auto mb-8 opacity-80">
          Explore professional courses and boost your career.
        </p>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search courses..."
            className="w-full pl-12 py-4 rounded-2xl bg-background text-foreground"
          />
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Filter className="text-muted-foreground" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* States */}
        {error && <p className="text-center text-destructive">{error}</p>}
        {loading && <p className="text-center">Loading courses...</p>}

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
            .filter(c => isInstructor || c.published)
            .map(course => (
              <article
                key={course._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition"
              >
                <div className="h-48 gradient-hero relative">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-16 h-16 text-primary-foreground/40 mx-auto mt-16" />
                  )}
                  <span className="absolute top-4 right-4 bg-accent px-3 py-1 rounded-full text-sm">
                    ₹{course.price}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.shortDescription || "No description"}
                  </p>

                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span><Star className="inline w-4 h-4 text-accent" /> 4.5</span>
                    <span><Clock className="inline w-4 h-4" /> 10h</span>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-sm">{course.instructor?.name}</span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-primary text-sm hover:underline"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft />
            </button>
            {[...Array(meta.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "font-bold" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === meta.pages}>
              <ChevronRight />
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2024 SmartLearn. All rights reserved.
      </footer>
    </div>
  );
}
