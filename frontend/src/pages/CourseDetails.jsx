import { useState, useEffect } from "react"; // React hooks for state management and side effects
import { useParams, Link, useNavigate } from "react-router-dom"; // React Router hooks for URL params, links, and navigation
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  Lock, 
  CheckCircle,
  Share2,
  AlertCircle,
  Trash2,
  ArrowLeft
} from "lucide-react"; // Icon library for UI elements
import { toast } from "sonner"; // Toast notification library
import { getCourseById, getLessonsByCourseId, deleteLesson } from "../services/courseService"; // API functions for course/lesson operations
import { enrollInCourse, checkEnrollmentStatus, createPaymentOrder, verifyPayment } from "../services/enrollmentService"; // API functions for enrollment and payment
import { useAuth } from "../context/AuthContext"; // Custom hook to access authentication context

export default function CourseDetails() {
  const { id } = useParams(); // Extract course ID from URL parameters
  const [course, setCourse] = useState(null); // State to store course data
  const [lessons, setLessons] = useState([]); // State to store course lessons
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [error, setError] = useState(null); // Error state for handling API errors
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track if user is enrolled in this course
  const [enrollLoading, setEnrollLoading] = useState(false); // Loading state for enrollment process

  const { user } = useAuth(); // Get current logged-in user from auth context
  const navigate = useNavigate(); // Hook for programmatic navigation (e.g., redirect to login)

  // Helper to check ownership/admin status safely
  const isOwner = user && course && course.instructor && ((user._id || user.id) === course.instructor._id || (user._id || user.id) === course.instructor._id?.toString()); // Check if current user is the course creator
  const isAdmin = user && user.role === 'admin'; // Check if current user is admin
  const hasAccess = isEnrolled || isOwner || isAdmin; // User has access if enrolled, owner, or admin

  // Effect to fetch course data and lessons on component mount or when ID/user changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course and lessons in parallel for better performance
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(id), // Fetch course details
          getLessonsByCourseId(id) // Fetch course lessons
        ]);
        
        setCourse(courseData.course); // Update course state
        setLessons(lessonsData.lessons || []); // Update lessons state

        // Check if current user is enrolled in this course
        if (user) {
          const status = await checkEnrollmentStatus(id);
          setIsEnrolled(status.isEnrolled);
        }
      } catch (err) {
        setError(err.message); // Set error state
        toast.error("Failed to load course details"); // Show error notification
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchData();
  }, [id, user]);

  // Handler for course enrollment (includes payment flow for paid courses)
  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll"); // Show error if not logged in
      navigate("/login"); // Redirect to login page
      return;
    }

    setEnrollLoading(true); // Set enrollment loading state
    try {
      // Create payment order (handles free courses automatically)
      const orderData = await createPaymentOrder(id);
      
      // If it's a free course, enrollment is already completed on backend
      if (orderData.isFree) {
        setIsEnrolled(true);
        toast.success("Successfully enrolled in the course!");
        return;
      }

      // For paid courses, configure and open Razorpay checkout modal
      const options = {
        key: orderData.key, // Razorpay key ID
        amount: orderData.order.amount, // Amount in paise (smallest currency unit)
        currency: orderData.order.currency, // Currency code (INR)
        name: "SmartLearn", // Merchant name
        description: `Enroll in ${orderData.course.title}`, // Payment description
        order_id: orderData.order.id, // Razorpay order ID
        handler: async function (response) { // Callback on successful payment
          try {
            // Verify payment signature on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: id
            });
            setIsEnrolled(true); // Update enrollment state
            toast.success("Payment successful! You're now enrolled.");
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: { // Pre-fill user details in checkout form
          name: user.name || "",
          email: user.email || ""
        },
        theme: {
          color: "#0f766e" // Teal color to match app theme
        },
        modal: {
          ondismiss: function() { // Callback when user closes payment modal
            setEnrollLoading(false);
            toast.info("Payment cancelled");
          }
        }
      };

      // Load Razorpay script dynamically if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => { // Open checkout after script loads
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        // Razorpay already loaded, open checkout immediately
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setEnrollLoading(false);
    }
  };

  const [expandedLessons, setExpandedLessons] = useState(new Set()); // State to track which lessons are expanded (Set for O(1) lookup)

  // Toggle individual lesson expansion
  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev); // Create copy of Set
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId); // Collapse if already expanded
      } else {
        newSet.add(lessonId); // Expand if collapsed
      }
      return newSet;
    });
  };

  // Toggle all lessons expanded/collapsed
  const toggleAllLessons = () => {
    if (expandedLessons.size === lessons.length) {
      setExpandedLessons(new Set()); // Collapse all if all are expanded
    } else {
      setExpandedLessons(new Set(lessons.map(l => l._id))); // Expand all
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /> {/* Spinning loader */}
      </div>
    );
  }

  // Error state UI - shown when course not found or API error
  if (error || !course) {
     return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" /> {/* Error icon */}
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
      {/* Back navigation button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-full hover:bg-secondary transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>

      {/* Hero Section - Course overview with thumbnail */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Course info */}
          <div>
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {course.category}
              </span>
            </div>
            
            {/* Course title */}
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-foreground">
              {course.title}
            </h1>
            
            {/* Short description */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {course.shortDescription}
            </p>
            
            {/* Course stats - student count and lesson count */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{course.studentCount || 0} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{lessons.length} lessons</span>
              </div>
            </div>

            {/* Instructor info with avatar */}
            <div className="flex items-center gap-3 text-sm mb-8">
               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                 {course.instructor?.name?.[0] || "I"} {/* First letter of instructor name */}
               </div>
               <div>
                 <p className="font-semibold text-foreground">Created by {course.instructor?.name || "Instructor"}</p>
                 <p className="text-muted-foreground">Updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</p>
               </div>
            </div>

            {/* Enrollment/Access button */}
            <div className="flex flex-wrap gap-4">
              {hasAccess ? (
                // Already enrolled or has access - show status badge
                <button 
                  disabled
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-default"
                >
                  <CheckCircle className="w-5 h-5" /> {isOwner ? "Owner Access" : isAdmin ? "Admin Access" : "Enrolled"}
                </button>
              ) : (
                // Not enrolled - show enroll/buy button
                <button 
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  className="px-8 py-4 gradient-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {enrollLoading ? "Processing..." : (course.price === 0 ? "Enroll Now - Free" : `Buy Now - ₹${course.price}`)}
                </button>
              )}
            </div>
          </div>

          {/* Right column - Course thumbnail with glow effect */}
          <div className="relative group">
             <div className="absolute -inset-1 bg-linear-to-r from-teal-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div> {/* Glow effect */}
             <div className="relative aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-2xl">
               {course.thumbnailUrl ? (
                 <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                   <PlayCircle className="w-20 h-20 opacity-50" /> {/* Fallback play icon */}
                 </div>
               )}
               
               {/* Overlay play button on hover */}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                   <PlayCircle className="w-12 h-12 text-white fill-white/50" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Content Section - Course description and lesson list */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
        {/* Main Column - About and Syllabus */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* About Course section */}
          <section>
            <h2 className="text-2xl font-bold font-display mb-6">About This Course</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
              {course.description || "No detailed description available."}
            </div>
          </section>

          {/* Course Content/Syllabus section */}
          <section>
            <h2 className="text-2xl font-bold font-display mb-6">Course Content</h2>
            <div className="border border-border rounded-2xl overflow-hidden">
               {/* Header with lesson count and expand/collapse toggle */}
               <div className="bg-muted/50 p-4 border-b border-border flex justify-between text-sm text-muted-foreground">
                 <span>{lessons.length} lessons</span>
                 <button onClick={toggleAllLessons} className="text-primary hover:opacity-75 font-medium cursor-pointer">
                   {expandedLessons.size === lessons.length ? "Collapse All" : "Expand All"}
                 </button>
               </div>
               {/* Lesson list */}
               <div className="divide-y divide-border bg-card">
                 {lessons.length > 0 ? (
                   lessons.map((lesson, idx) => (
                     <div 
                        key={lesson._id} 
                        className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => toggleLesson(lesson._id)} // Toggle lesson expansion on click
                     >
                       {/* Lesson access icon - play if accessible, lock if not */}
                       <div className="mt-1">
                         {(hasAccess || lesson.isFree) ? (
                           lesson.videoUrl ? (
                             <a 
                               href={lesson.videoUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-primary hover:scale-110 transition-transform block"
                               onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
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
                       {/* Lesson content */}
                       <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                           <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {idx + 1}. {lesson.title}
                           </h3>
                           <span className="text-xs text-muted-foreground">{lesson.duration || 10}m</span>
                         </div>
                         {/* Lesson description - truncated or full based on expanded state */}
                         <p className={`text-sm text-muted-foreground ${expandedLessons.has(lesson._id) ? '' : 'line-clamp-1'}`}>
                           {lesson.content || "Watch this lesson."}
                         </p>
                         
                         {/* Video link shown when lesson is expanded and accessible */}
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
                       {/* Free preview badge */}
                       {lesson.isFree && (
                         <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                           Free Preview
                         </span>
                       )}
                       
                       {/* Delete button - visible only to owner/admin */}
                       {(isOwner || isAdmin) && (
                         <button
                           onClick={(e) => {
                             e.stopPropagation(); // Prevent triggering parent click
                             if(window.confirm('Delete this lesson?')) {
                               deleteLesson(lesson._id)
                                 .then(() => {
                                   toast.success('Lesson deleted');
                                   setLessons(prev => prev.filter(l => l._id !== lesson._id)); // Remove from state
                                 })
                                 .catch(err => toast.error('Failed to delete'));
                             }
                           }}
                           className="ml-2 p-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all shadow-sm hover:shadow-md"
                           title="Delete Lesson - Risky!"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                     </div>
                   ))
                 ) : (
                   // Empty state when no lessons exist
                   <div className="p-8 text-center text-muted-foreground">
                     <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                     <p>No lessons added yet.</p>
                   </div>
                 )}
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Instructor info card */}
        <div className="space-y-8">
           <div className="bg-card border border-border p-6 rounded-2xl shadow-card sticky top-24"> {/* Sticky positioning for scroll */}
             <h3 className="font-bold text-lg mb-4">Instructor</h3>
             <div className="flex items-center gap-4 mb-4">
               {/* Instructor avatar */}
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
