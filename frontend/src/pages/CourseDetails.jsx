import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  Lock, 
  CheckCircle,
  Share2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { getCourseById, getLessonsByCourseId } from "../services/courseService";
import { enrollInCourse, checkEnrollmentStatus } from "../services/enrollmentService";
import { useAuth } from "../context/AuthContext";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate(); // For redirecting to login

  // Helper to check ownership/admin status safely
  const isOwner = user && course && course.instructor && user._id === course.instructor._id;
  const isAdmin = user && user.role === 'admin';
  const hasAccess = isEnrolled || isOwner || isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(id),
          getLessonsByCourseId(id)
        ]);
        
        setCourse(courseData.course);
        setLessons(lessonsData.lessons || []);

        // Check if enrolled
        if (user) {
          const status = await checkEnrollmentStatus(id);
          setIsEnrolled(status.isEnrolled);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    setEnrollLoading(true);
    try {
      await enrollInCourse(id);
      setIsEnrolled(true);
      toast.success("Successfully enrolled in the course!");
    } catch (err) {
      toast.error(err.message || "Failed to enroll");
    } finally {
      setEnrollLoading(false);
    }
  };

  const [expandedLessons, setExpandedLessons] = useState(new Set());

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const toggleAllLessons = () => {
    if (expandedLessons.size === lessons.length) {
      setExpandedLessons(new Set());
    } else {
      setExpandedLessons(new Set(lessons.map(l => l._id)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // ... error check ...
  if (error || !course) {
     // ... (keep existing)
     return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "The requested course could not be loaded."}</p>
        <Link to="/courses" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:opacity-90">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {course.category}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-foreground">
              {course.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {course.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{lessons.length} lessons</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm mb-8">
               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                 {course.instructor?.name?.[0] || "I"}
               </div>
               <div>
                 <p className="font-semibold text-foreground">Created by {course.instructor?.name || "Instructor"}</p>
                 <p className="text-muted-foreground">Updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {hasAccess ? (
                <button 
                  disabled
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-default"
                >
                  <CheckCircle className="w-5 h-5" /> {isOwner ? "Owner Access" : isAdmin ? "Admin Access" : "Enrolled"}
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  className="px-8 py-4 gradient-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {enrollLoading ? "Processing..." : (course.price === 0 ? "Enroll Now - Free" : `Buy Now - $${course.price}`)}
                </button>
              )}
            </div>
          </div>

          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
             <div className="relative aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-2xl">
               {course.thumbnailUrl ? (
                 <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                   <PlayCircle className="w-20 h-20 opacity-50" />
                 </div>
               )}
               
               {/* Overlay Play Button */}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                   <PlayCircle className="w-12 h-12 text-white fill-white/50" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* About Course */}
          <section>
            <h2 className="text-2xl font-bold font-display mb-6">About This Course</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
              {course.description || "No detailed description available."}
            </div>
          </section>

          {/* Syllabus */}
          <section>
            <h2 className="text-2xl font-bold font-display mb-6">Course Content</h2>
            <div className="border border-border rounded-2xl overflow-hidden">
               <div className="bg-muted/50 p-4 border-b border-border flex justify-between text-sm text-muted-foreground">
                 <span>{lessons.length} lessons</span>
                 <button onClick={toggleAllLessons} className="text-primary hover:opacity-75 font-medium cursor-pointer">
                   {expandedLessons.size === lessons.length ? "Collapse All" : "Expand All"}
                 </button>
               </div>
               <div className="divide-y divide-border bg-card">
                 {lessons.length > 0 ? (
                   lessons.map((lesson, idx) => (
                     <div 
                        key={lesson._id} 
                        className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => toggleLesson(lesson._id)}
                     >
                       <div className="mt-1">
                         {(hasAccess || lesson.isFree) ? (
                           lesson.videoUrl ? (
                             <a 
                               href={lesson.videoUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-primary hover:scale-110 transition-transform block"
                               onClick={(e) => e.stopPropagation()}
                               title="Watch Video"
                             >
                               <PlayCircle className="w-5 h-5" />
                             </a>
                           ) : (
                             <PlayCircle className="w-5 h-5 text-primary" />
                           )
                         ) : (
                           <Lock className="w-5 h-5 text-muted-foreground" />
                         )}
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                           <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {idx + 1}. {lesson.title}
                           </h3>
                           <span className="text-xs text-muted-foreground">{lesson.duration || 10}m</span>
                         </div>
                         <p className={`text-sm text-muted-foreground ${expandedLessons.has(lesson._id) ? '' : 'line-clamp-1'}`}>
                           {lesson.content || "Watch this lesson."}
                         </p>
                         
                         {(hasAccess || lesson.isFree) && lesson.videoUrl && expandedLessons.has(lesson._id) && (
                            <a 
                              href={lesson.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <PlayCircle className="w-4 h-4" /> Watch Video
                            </a>
                         )}
                       </div>
                       {lesson.isFree && (
                         <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                           Free Preview
                         </span>
                       )}
                     </div>
                   ))
                 ) : (
                   <div className="p-8 text-center text-muted-foreground">
                     <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                     <p>No lessons added yet.</p>
                   </div>
                 )}
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-card border border-border p-6 rounded-2xl shadow-card sticky top-24">
             <h3 className="font-bold text-lg mb-4">Instructor</h3>
             <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold shadow-inner">
                 {course.instructor?.name?.[0] || "?"}
               </div>
               <div>
                 <p className="font-bold text-lg">{course.instructor?.name}</p>
                 <p className="text-sm text-muted-foreground">Senior Instructor</p>
               </div>
             </div>
             <p className="text-sm text-muted-foreground mb-6">
               Passionate about teaching and helping others learn new skills. Join my course to master this topic!
             </p>

           </div>
        </div>
      </div>
    </div>
  );
}
