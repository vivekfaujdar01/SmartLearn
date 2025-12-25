import { useState, useEffect, useCallback } from "react"; // React hooks for state management and side effects
import { Link } from "react-router-dom"; // Navigation component for client-side routing
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Star,
  Filter,
  Play,
  GraduationCap,
  Sparkles,
  Trash2
} from "lucide-react"; // Icon library for UI elements 
import { listCourses, deleteCourse } from "../services/courseService"; // API service functions for course operations
import { toast } from "sonner"; // Toast notification library for user feedback

const categories = ["All", "Development", "Design", "Business", "Marketing", "AI/ML"]; // Available course categories for filtering

import { useAuth } from "../context/AuthContext"; // Custom hook to access authentication context

export default function Courses() {
  const [courses, setCourses] = useState([]); // State to store fetched courses array
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for handling API errors
  const [searchQuery, setSearchQuery] = useState(""); // Search input value for filtering courses
  const [selectedCategory, setSelectedCategory] = useState("All"); // Currently selected category filter

  const { user } = useAuth(); // Get current logged-in user from auth context
  const isInstructor = user?.role === "instructor" || user?.role === "admin"; // Check if user has instructor/admin privileges

  // Handler to delete a course after confirmation
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return; // Confirmation dialog before deletion

    try {
      await deleteCourse(courseId); // Call API to delete course
      toast.success("Course deleted successfully"); // Show success notification
      fetchCourses(); // Refresh the courses list after deletion
    } catch (err) {
      toast.error(err.message || "Failed to delete course"); // Show error notification on failure
    }
  };

  // Memoized function to fetch courses from API with search and category filters
  const fetchCourses = useCallback(async () => {
    setLoading(true); // Set loading state before API call
    setError(null); // Clear any previous errors
    try {
      const data = await listCourses({
        search: searchQuery, // Pass search query to API
        category: selectedCategory === "All" ? "" : selectedCategory // Pass category filter (empty string for "All")
      });

      setCourses(data.courses || []); // Update courses state with API response
    } catch (err) {
      setError(err.message || "Failed to load courses"); // Set error state on failure
    } finally {
      setLoading(false); // Reset loading state after API call completes
    }
  }, [searchQuery, selectedCategory]); // Dependencies: re-create when search or category changes

  // Effect to fetch courses when fetchCourses function changes (due to search/category changes)
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handler for search input changes
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query state on input change
  };

  // Handler for category filter button clicks
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update selected category state
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header section - currently empty placeholder */}

      {/* Hero section with search functionality */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <Sparkles className="mx-auto mb-4" /> {/* Decorative sparkles icon */}
        <h1 className="text-5xl font-display font-bold mb-4">
          Learn From Expert Instructors
        </h1>
        <p className="max-w-xl mx-auto mb-8 opacity-80">
          Explore professional courses and boost your career.
        </p>

        {/* Search input with icon */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> {/* Search icon positioned inside input */}
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search courses..."
            className="w-full pl-12 py-4 rounded-2xl bg-background text-foreground shadow-xl ring-1 ring-white/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
      </section>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Filter className="text-muted-foreground" /> {/* Filter icon */}
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm tilt-button ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground" // Active category styling
                  : "border border-border text-muted-foreground hover:text-foreground" // Inactive category styling
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error and loading state indicators */}
        {error && <p className="text-center text-destructive">{error}</p>}
        {loading && <p className="text-center">Loading courses...</p>}

        {/* Course cards grid - responsive layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
            .filter(course => course.published || (user && (user._id === course.instructor?._id || user._id === course.instructor))) // Filter: show published courses OR unpublished if user is the instructor
            .map(course => (
              <article
                key={course._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-card course-tilt flex flex-col group"
              >
                {/* Clickable course card link */}
                <Link to={`/courses/${course._id}`} className="flex-1">
                  {/* Course thumbnail/image section */}
                  <div className="h-48 gradient-hero relative overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" // Zoom effect on hover
                      />
                    ) : (
                      <GraduationCap className="w-16 h-16 text-primary-foreground/40 mx-auto mt-16" /> // Fallback icon if no thumbnail
                    )}
                    {/* Hover overlay with "View Course" button */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">View Course</span>
                    </div>
                  </div>

                  {/* Course info section */}
                  <div className="p-5">
                    <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                      {course.shortDescription || "No description"} {/* Short description with fallback */}
                    </p>

                    {/* Course stats: rating and duration */}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span><Star className="inline w-4 h-4 text-accent" /> 4.5</span>
                      <span><Clock className="inline w-4 h-4" /> 10h</span>
                    </div>
                  </div>
                </Link>

                {/* Course footer with instructor name and action buttons */}
                <div className="p-5 pt-0">
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-sm text-muted-foreground">{course.instructor?.name}</span>
                    <div className="flex items-center gap-3">
                      {/* Delete button - visible only to admin or course instructor */}
                      {(user?.role === "admin" || (user?.role === "instructor" && user?._id === course.instructor?._id)) && (
                         <button 
                           onClick={(e) => {
                             e.preventDefault(); // Prevent link navigation
                             e.stopPropagation(); // Stop event bubbling
                             handleDelete(course._id);
                           }}
                           className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition-all shadow-sm hover:shadow-md"
                           title="Delete Course - Risky"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </main>

      {/* Page footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2025 SmartLearn. All rights reserved.
      </footer>
    </div>
  );
}
