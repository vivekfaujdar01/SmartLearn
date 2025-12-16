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
  X
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

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                SmartLearn
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-primary font-medium">
                Home
              </Link>
              <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                Courses
              </Link>
              <Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">
                Articles
              </Link>
              <Link to="/games" className="text-muted-foreground hover:text-foreground transition-colors">
                Games
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-4 py-2 gradient-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <Link to="/" className="text-primary font-medium">Home</Link>
                <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
                <Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">Articles</Link>
                <Link to="/games" className="text-muted-foreground hover:text-foreground transition-colors">Games</Link>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Link to="/login" className="flex-1 px-4 py-2 text-center gradient-primary text-primary-foreground font-medium rounded-lg">
                    Get Started
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

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
                className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-primary-foreground/20 text-primary-foreground font-semibold rounded-xl hover:bg-primary-foreground/30 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full pl-14 pr-32 py-5 bg-background border border-input rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-xl text-lg"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 gradient-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
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
                className="group p-6 bg-card border border-border rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
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
                className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 gradient-hero relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary-foreground/30" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-sm font-bold rounded-full">
                    ${course.price}
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
                className="p-6 bg-card border border-border rounded-2xl shadow-card"
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

      {/* CTA Section */}
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
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/courses" 
              className="w-full sm:w-auto px-8 py-4 bg-primary-foreground/20 text-primary-foreground font-semibold rounded-xl hover:bg-primary-foreground/30 transition-all duration-200 backdrop-blur-sm"
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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">
                  SmartLearn
                </span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Empowering learners worldwide with quality education and expert guidance.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Browse Courses</Link></li>
                <li><Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Articles</Link></li>
                <li><Link to="/games" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Games</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 SmartLearn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
