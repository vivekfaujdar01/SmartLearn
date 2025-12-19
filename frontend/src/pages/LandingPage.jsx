import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  Play,
  Users,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Menu,
  X,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Send
} from "lucide-react";

const featuredCourses = [
  {
    id: 1,
    title: "Complete React Development",
    instructor: "Sarah Johnson",
    avatar: "SJ",
    category: "Development",
    rating: 4.9,
    students: 12500,
    price: 89.99,
    image: "gradient-hero"
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    instructor: "Michael Chen",
    avatar: "MC",
    category: "Design",
    rating: 4.8,
    students: 8900,
    price: 79.99,
    image: "gradient-hero"
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Emily Davis",
    avatar: "ED",
    category: "Data Science",
    rating: 4.9,
    students: 15200,
    price: 99.99,
    image: "gradient-hero"
  }
];

const features = [
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience"
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description: "Access courses anytime, anywhere with lifetime access to content"
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn recognized certificates to showcase your achievements"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a thriving community of learners and get help when needed"
  }
];

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "200+", label: "Expert Instructors" },
  { value: "500+", label: "Quality Courses" },
  { value: "95%", label: "Satisfaction Rate" }
];

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Frontend Developer",
    avatar: "AR",
    content: "SmartLearn transformed my career. The courses are well-structured and the instructors are amazing!",
    rating: 5
  },
  {
    name: "Lisa Wang",
    role: "UX Designer",
    avatar: "LW",
    content: "The design courses here are top-notch. I landed my dream job after completing just two courses.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Data Analyst",
    avatar: "DK",
    content: "Best investment I've made in my education. The practical projects really helped solidify my learning.",
    rating: 5
  }
];

// Imports updated to include useAuth
import { useAuth } from "../context/AuthContext";

// ... Inside LandingPage component
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth(); // Get user from context

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}


      {/* Hero Section */}
      <section className="gradient-hero py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              #1 Learning Platform for Professionals
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-primary-foreground mb-6 leading-tight">
              Unlock Your Potential with
              <span className="block text-accent">World-Class Learning</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Join thousands of learners mastering new skills with courses taught by industry experts. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/courses" 
                className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg tilt-button glow-hover"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              {/* Watch Demo Removed */}
            </div>

            {/* Search Bar */}
            {/* Trusted By / Popular Tags */}
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <p className="text-primary-foreground/60 text-sm font-medium mb-6 uppercase tracking-wider">
                Trusted by learners
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center stat-tilt">
                <div className="text-3xl sm:text-4xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg">
              We provide the tools, resources, and support to help you achieve your learning goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-card border border-border rounded-2xl shadow-card feature-tilt"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                Popular Courses
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Featured Courses
              </h2>
            </div>
            <Link 
              to="/courses" 
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div 
                key={course.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card course-tilt"
              >
                <div className="h-48 gradient-hero relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary-foreground/30" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {course.avatar}
                    </div>
                    <span className="text-sm text-muted-foreground">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-medium text-foreground">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              What Our Students Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied learners who have transformed their careers with us.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-6 bg-card border border-border rounded-2xl shadow-card testimonial-tilt"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Hide if logged in */}
      {!user && (
      <section className="py-20 sm:py-28 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join our community of learners and unlock access to hundreds of courses taught by industry experts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 tilt-button glow-hover"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/courses" 
              className="w-full sm:w-auto px-8 py-4 bg-primary-foreground/20 text-primary-foreground font-semibold rounded-xl hover:bg-primary-foreground/30 transition-all duration-200 backdrop-blur-sm tilt-button"
            >
              Browse Courses
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              <span>Access anywhere</span>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-6">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">
                  SmartLearn
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">
                Empowering learners worldwide with quality education, expert guidance, and a community that cares about your success.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Instagram, href: "#" }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary flex items-center justify-center social-tilt"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-3 md:col-span-4">
              <h4 className="font-display font-bold text-foreground mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">Browse Courses</Link></li>
                <li><Link to="/articles" className="text-muted-foreground hover:text-primary transition-colors">Articles</Link></li>
                <li><Link to="/instructors" className="text-muted-foreground hover:text-primary transition-colors">Instructors</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3 md:col-span-4">
              <h4 className="font-display font-bold text-foreground mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Partners</a></li>
              </ul>
            </div>
            
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 SmartLearn. All rights reserved.
            </p>
            
            {!user && (
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
