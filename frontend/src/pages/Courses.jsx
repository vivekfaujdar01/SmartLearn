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
  Sparkles,
  Trash2
} from "lucide-react";
import { listCourses, deleteCourse } from "../services/courseService";
import { toast } from "sonner";

const categories = ["All", "Development", "Design", "Business", "Marketing", "AI/ML"];

import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully");
      // Refresh list
      fetchCourses();
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
    }
  };

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
            className="w-full pl-12 py-4 rounded-2xl bg-background text-foreground shadow-xl ring-1 ring-white/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
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
              className={`px-4 py-2 rounded-full text-sm tilt-button ${
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
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-card course-tilt"
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
                    <div className="flex items-center gap-3">
                      {(user?.role === "admin" || (user?.role === "instructor" && user?._id === course.instructor?._id)) && (
                         <button 
                           onClick={() => handleDelete(course._id)}
                           className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition-all shadow-sm hover:shadow-md"
                           title="Delete Course - Risky"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-primary text-sm hover:underline"
                      >
                        View Course
                      </Link>
                    </div>
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
