import { useState, useEffect, useCallback } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { listCourses } from "@/services/courseService";
import { CourseCard } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import { CoursePagination } from "./CoursePagination";
import { CourseLoadingSkeleton } from "./CourseLoadingSkeleton";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [params, setParams] = useState({
    page: 1,
    limit: 8,
    search: "",
    category: "",
    price: "",
    sort: "createdAt:desc",
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const validatedParams = { ...params, page: params.page };

    try {
      const data = await listCourses(validatedParams);
      setCourses(data.courses);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleParamChange = (field, value) => {
    setParams((prev) => ({
      ...prev,
      [field]: value,
      ...(field !== "page" && { page: 1 }),
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.pages) {
      handleParamChange("page", newPage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden gradient-hero py-16 sm:py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <div className="p-2.5 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground/80 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Learn from the best
            </span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground text-center mb-4 animate-slide-up">
            Course Catalog
          </h1>
          
          <p className="text-lg text-primary-foreground/80 text-center max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            Discover courses crafted by industry experts to help you master new skills and advance your career.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        {/* Filters */}
        <CourseFilters params={params} onParamChange={handleParamChange} />

        {/* Error State */}
        {error && (
          <div className="text-center p-8 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl mb-8 animate-scale-in">
            <p className="font-semibold text-lg">Failed to load courses</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && <CourseLoadingSkeleton />}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={course._id} course={course} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <CoursePagination
            params={params}
            meta={meta}
            coursesCount={courses.length}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}
