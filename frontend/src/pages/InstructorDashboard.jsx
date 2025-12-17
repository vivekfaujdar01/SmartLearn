import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, Trash2, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { listCourses, deleteCourse } from "../services/courseService";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || (user.role !== "instructor" && user.role !== "admin")) {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }

    const loadCourses = async () => {
      try {
        // Backend doesn't support "get my courses" specifically yet, but we can filter or search.
        // For now, listing all and filtering (ideal would be API endpoint for my-courses)
        // Wait, listCourses is public. Let's use it and filter client side if needed, 
        // or just rely on backend if we implemented "my courses". 
        // Admin/Instructor roles usually see what they own. 
        // The courseService uses listCourses which is public.
        // Ideally backend should have `GET /api/courses/my` but user didn't ask to create backend routes.
        // We will just fetch all and filter by user ID for now to be safe.
        
        
        const data = await listCourses({ limit: 100 });
        
        // Backend returns `user.id` in auth response, but course population returns `_id`
        const userId = user.id || user._id;

        const myCourses = data.courses.filter(c => {
          const courseInstructorId = c.instructor?._id || c.instructor;
          return courseInstructorId === userId || user.role === 'admin';
        });
        setCourses(myCourses);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [navigate, user]);




  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      await deleteCourse(id);
      setCourses(courses.filter(c => c._id !== id));
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and content</p>
          </div>
          <Link 
            to="/instructor/create-course" 
            className="px-4 py-2 gradient-primary text-primary-foreground rounded-xl flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" /> Create Course
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
                <Link to="/instructor/create-course" className="text-primary hover:underline">
                  Create your first course
                </Link>
              </div>
            ) : (
              courses.map(course => (
                <div key={course._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                  <Link to={`/courses/${course._id}`} className="block">
                    <div className="h-40 bg-muted relative group-hover:opacity-90 transition-opacity">
                      {course.thumbnailUrl ? (
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <BookOpen className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                      <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${course.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-5">
                    <Link to={`/courses/${course._id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                    </Link>
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentCount || 0} students</span>
                      <span className="flex items-center gap-1">₹{course.price}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Link 
                        to={`/instructor/course/${course._id}/edit`} 
                        className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium text-center hover:bg-primary/20 transition"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/instructor/course/${course._id}/add-chapter`} 
                        className="flex-1 px-3 py-2 bg-secondary/10 text-secondary-foreground rounded-lg text-sm font-medium text-center hover:bg-secondary/20 transition"
                      >
                        + Chapter
                      </Link>
                      <button 
                        onClick={() => handleDelete(course._id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
                        title="Delete Course (Irreversible)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
