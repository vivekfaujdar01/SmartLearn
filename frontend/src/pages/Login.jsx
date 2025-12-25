import { useState } from "react"; // React hook for managing component state
import { useNavigate, Link } from "react-router-dom"; // Hooks for navigation and creating links
import { loginUser } from "../services/auth"; // API function to authenticate user
import { toast } from "sonner"; // Toast notification library for user feedback
import { BookOpen, Mail, Lock, ArrowRight, Sparkles, Shield } from "lucide-react"; // Icons for UI elements
import { useAuth } from "../context/AuthContext"; // Custom hook to access global auth context

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" }); // State for form input values
  const [adminSecret, setAdminSecret] = useState(""); // State for admin secret key input
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Toggle state for admin login mode
  const [isLoading, setIsLoading] = useState(false); // Loading state during form submission
  const navigate = useNavigate(); // Hook for programmatic navigation after login
  const { login } = useAuth(); // Global auth context login function to update auth state

  // Handler to update form data when input fields change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Spread existing data and update changed field

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Set loading state to show spinner

    try {
      // If admin checkbox is checked, include admin secret in request payload
      const payload = isAdminLogin ? { ...formData, role: 'admin', adminSecret } : formData;
      const data = await loginUser(payload.email, payload.password, payload.adminSecret); // Call login API

      // Update global auth context with user data and token
      login(data.user, data.token);

      // Navigate to appropriate dashboard based on user role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard"); // Admin goes to admin dashboard
      } else if (data.user.role === "instructor") {
        navigate("/instructor/dashboard"); // Instructor goes to instructor dashboard
      } else {
        navigate("/dashboard"); // Students go to student dashboard
      }
    } catch (err) {
      toast.error(err.message || "Login failed"); // Show error notification on failure
    } finally {
      setIsLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT SIDE - Decorative hero section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo and brand name */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" /> {/* Book icon for brand */}
            </div>
            <span className="text-2xl font-display font-bold text-primary-foreground">
              SmartLearn
            </span>
          </div>

          {/* Hero text */}
          <h1 className="text-4xl xl:text-5xl font-display font-extrabold text-primary-foreground mb-6">
            Unlock Your <span className="text-accent">Learning Potential</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-md">
            Access expert-led courses and grow your career.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Form header with welcome message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Sparkles className="w-4 h-4" /> {/* Decorative sparkle icon */}
              Welcome back!
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input field with icon */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> {/* Email icon */}
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 py-3.5 bg-card border border-input rounded-xl"
              />
            </div>

            {/* Password input field with icon */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> {/* Lock icon */}
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 py-3.5 bg-card border border-input rounded-xl"
              />
            </div>

            {/* Admin login toggle checkbox */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="adminLogin" 
                checked={isAdminLogin} 
                onChange={(e) => setIsAdminLogin(e.target.checked)} // Toggle admin login mode
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="adminLogin" className="text-sm cursor-pointer select-none">
                Login as Administrator
              </label>
            </div>

            {/* Admin secret input - only visible when admin login is selected */}
            {isAdminLogin && (
              <div className="relative animate-in fade-in slide-in-from-top-2">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> {/* Shield icon */}
                <input
                  type="password"
                  placeholder="Admin Secret"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                  className="w-full pl-12 py-3.5 bg-card border border-input rounded-xl"
                />
              </div>
            )}

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isLoading} // Disable button while loading
              className="w-full py-4 gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              {isLoading ? "Signing in..." : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" /> {/* Arrow icon */}
                </>
              )}
            </button>
          </form>

          {/* Link to registration page for new users */}
          <p className="text-center mt-8 text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary font-semibold">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
