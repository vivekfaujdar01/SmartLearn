import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyEnrollments } from "../services/enrollmentService";
import { fetchArticles } from "../services/articleService";
import { BookOpen, PlayCircle, Sparkles, LayoutDashboard, PenTool } from "lucide-react";
import { toast } from "sonner";
import ArticleList from "../components/ArticleList";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const enrollData = await getMyEnrollments();
        setEnrollments(enrollData.enrollments || []);
        
        try {
            // Fetch my articles using the /my/articles endpoint logic which we added to service via fetchArticles potentially
            // Wait, fetchArticles takes params. We need a specific call for "my articles".
            // Let's modify fetchArticles or assume we have getMyArticles in service. 
            // I checked service earlier, it didn't have getMyArticles export.
            // I need to add `getMyArticles` to service first or use direct fetch here. 
            // To be consistent, I'll use direct fetch here for speed or better yet, I'll add it to service in the next tool call.
            // But for now, I will use direct fetch to avoid context switching too much in one turn.
            const token = localStorage.getItem("token");
             const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/my/articles`, {
                headers: { Authorization: `Bearer ${token}` }
             });
             const articlesData = await res.json();
             if (res.ok) setMyArticles(articlesData);
        } catch (err) {
            console.error("Failed to load articles", err);
        }

      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              My Learning
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Continue where you left off.
            </p>
          </div>
          <div className="flex gap-3">
             <Link to="/articles/create" className="px-5 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors flex items-center gap-2">
                <PenTool className="w-4 h-4" /> Write Article
             </Link>
             <Link to="/courses" className="px-5 py-2.5 gradient-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-colors">
                Browse Courses
             </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto md:mx-0">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Enrolled Courses</h3>
            <p className="text-3xl font-bold">{enrollments.length}</p>
          </div>
           <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">My Articles</h3>
            <p className="text-3xl font-bold">{myArticles.length}</p>
          </div>
        </div>

        {/* Course List */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Enrolled Courses
          </h2>

          {enrollments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                return (
                  <Link 
                    key={enrollment._id} 
                    to={`/courses/${course._id}`}
                    className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 block"
                  >
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {course.thumbnailUrl ? (
                         <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-full font-medium flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" /> Continue Learning
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Reading
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.shortDescription}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">Start your learning journey today!</p>
              <Link to="/courses" className="px-8 py-3 gradient-primary text-primary-foreground font-medium rounded-xl hover:opacity-90">
                Explore Courses
              </Link>
            </div>
          )}
        </section>

        {/* My Articles Section */}
        <section>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <PenTool className="w-5 h-5" /> My Published Articles
                </h2>
                <Link to="/articles/create" className="text-sm text-primary hover:underline">Write New</Link>
             </div>
             
             <ArticleList articles={myArticles} emptyMessage="You haven't written any articles yet." />
        </section>

      </div>
    </div>
  );
}
