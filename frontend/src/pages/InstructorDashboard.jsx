import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, Trash2, Loader2, Users, FileText, LayoutDashboard, PenTool } from "lucide-react";
import { toast } from "sonner";
import { listCourses, deleteCourse } from "../services/courseService";
import ArticleList from "../components/ArticleList";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || ({student: false, instructor: true, admin: true})[user.role] !== true) {
      // simple check, though backend protects naturally
    } 

    const loadData = async () => {
      try {
        // Load Courses
        const data = await listCourses({ limit: 100 });
        const userId = user.id || user._id;
        const myCourses = data.courses.filter(c => {
          const courseInstructorId = c.instructor?._id || c.instructor;
          return courseInstructorId === userId || user.role === 'admin'; // simplification
        });
        setCourses(myCourses);

        // Load Articles
        try {
             const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/my/articles`, {
                headers: { Authorization: `Bearer ${token}` }
             });
             const articlesData = await res.json();
             if (res.ok) setMyArticles(articlesData);
        } catch (err) {
            console.error(err);
        }

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

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
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage your courses and content</p>
          </div>
          <div className="flex gap-3">
             <Link 
                to="/articles/create" 
                className="px-5 py-2.5 gradient-primary text-primary-foreground rounded-xl flex items-center gap-2 font-semibold shadow-lg tilt-button glow-hover"
              >
                <PenTool className="w-4 h-4" /> Write Article
              </Link>
             <Link 
               to="/instructor/create-course" 
               className="px-5 py-2.5 gradient-primary text-primary-foreground rounded-xl flex items-center gap-2 font-semibold shadow-lg tilt-button glow-hover"
             >
               <Plus className="w-4 h-4" /> Create Course
             </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Courses Section */}
            <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> My Courses
                </h2>
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
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center"
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
            </section>

             {/* Articles Section */}
             <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5" /> My Published Articles
                    </h2>
                </div>
                <ArticleList articles={myArticles} emptyMessage="No published articles." />
             </section>
          </>
        )}
      </div>
    </div>
  );
}
