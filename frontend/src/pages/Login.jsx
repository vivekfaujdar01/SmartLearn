import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import { toast } from "sonner";
import { BookOpen, Mail, Lock, ArrowRight, Sparkles, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [adminSecret, setAdminSecret] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Global auth context login

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If admin checkbox is checked, pass the secret
      const payload = isAdminLogin ? { ...formData, role: 'admin', adminSecret } : formData;
      const data = await loginUser(payload.email, payload.password, payload.adminSecret);

      // Update global context
      login(data.user, data.token);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-primary-foreground">
              SmartLearn
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-display font-extrabold text-primary-foreground mb-6">
            Unlock Your <span className="text-accent">Learning Potential</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-md">
            Access expert-led courses and grow your career.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Welcome back!
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

            {/* Admin Toggle */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="adminLogin" 
                checked={isAdminLogin} 
                onChange={(e) => setIsAdminLogin(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="adminLogin" className="text-sm cursor-pointer select-none">
                Login as Administrator
              </label>
            </div>

            {/* Admin Secret */}
            {isAdminLogin && (
              <div className="relative animate-in fade-in slide-in-from-top-2">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              {isLoading ? "Signing in..." : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

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
