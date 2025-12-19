import { useState, useEffect } from "react";
import { fetchArticles } from "../services/articleService";
import { listCourses, deleteCourse } from "../services/courseService";
import { toast } from "sonner";
import { Shield, BookOpen, Trash2, Edit, Loader2, FileText, Plus, PenTool, GraduationCap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ArticleList from "../components/ArticleList";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const loadCourses = async () => {
    try {
      const data = await listCourses({ limit: 0 }); // Fetch all courses (no limit)
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully");
      loadCourses(); // Refresh list
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        // Load All Articles (Admin View)
        const data = await fetchArticles(token, true); // true = isAdmin
        
        const mapped = data.map((a) => ({
          id: a._id,
          title: a.title,
          author: a.author?.name || "Unknown",
          date: new Date(a.createdAt).toLocaleDateString(),
        }));
        setArticles(mapped);

        // Load My Personal Articles
        try {
             const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/my/articles`, {
                headers: { Authorization: `Bearer ${token}` }
             });
             const myData = await res.json();
             if (res.ok) setMyArticles(myData);
        } catch (err) {
            console.error(err);
        }

        // Load All Courses
        await loadCourses();

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage platform content</p>
            </div>
          </div>
          <Link to="/articles/create" className="px-5 py-2.5 gradient-primary text-primary-foreground font-semibold rounded-xl shadow-lg tilt-button glow-hover flex items-center gap-2">
            <PenTool className="w-4 h-4" /> Write Article
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* My Articles Section */}
            <section>
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5" /> My Personal Articles
                    </h2>
                 </div>
                 <ArticleList articles={myArticles} emptyMessage="You haven't written any articles yet." />
            </section>

            {/* Global Articles Section */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mt-10">
                <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Manage All Platform Articles ({articles.length})
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
                        <td className="p-4 font-medium">
                            <Link to={`/articles/${article.id}`} className="hover:text-primary underline-offset-4 hover:underline">
                                {article.title}
                            </Link>
                        </td>
                        <td className="p-4 text-muted-foreground">{article.author}</td>
                        <td className="p-4 text-muted-foreground">{article.date}</td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                            <Link 
                            to={`/articles/${article.id}/edit`}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"
                            title="Edit Article"
                            >
                            <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                            onClick={() => toast.info("Use Article Details page to delete")}
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

            {/* Global Courses Section */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mt-10">
                <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Manage All Platform Courses ({courses.length})
                </h2>
                <Link to="/instructor/courses/create" className="px-4 py-2 gradient-primary text-primary-foreground font-semibold rounded-lg shadow-md flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Create Course
                </Link>
                </div>
                
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Instructor</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-muted/30 transition">
                        <td className="p-4 font-medium">
                            <Link to={`/courses/${course._id}`} className="hover:text-primary underline-offset-4 hover:underline">
                                {course.title}
                            </Link>
                        </td>
                        <td className="p-4 text-muted-foreground">{course.instructor?.name || "Unknown"}</td>
                        <td className="p-4 text-muted-foreground">{course.category || "General"}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {course.published ? "Published" : "Draft"}
                            </span>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                            <Link 
                            to={`/instructor/course/${course._id}/edit`}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"
                            title="Edit Course"
                            >
                            <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                            onClick={() => handleDeleteCourse(course._id)}
                            title="Delete Course"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                        </tr>
                    ))}
                    {courses.length === 0 && (
                        <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">
                            No courses available on the platform yet.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
