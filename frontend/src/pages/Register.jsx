import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  ChevronDown
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [adminSecret, setAdminSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        name,
        email,
        password,
        role
      };

      // ✅ Only send adminSecret if registering admin
      if (role === "admin") {
        body.adminSecret = adminSecret;
      }

      const data = await registerUser(body);

      // ✅ Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT SECTION (unchanged UI) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-primary-foreground">
              SmartLearn
            </span>
          </div>

          <h1 className="text-4xl font-display font-extrabold text-primary-foreground mb-6">
            Start Your <span className="text-accent">Learning Journey</span>
          </h1>

          <p className="text-primary-foreground/80 mb-10">
            Create your account and access expert-led courses.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3 text-primary-foreground/90">
              <Sparkles className="w-4 h-4" /> Unlimited access
            </div>
            <div className="flex gap-3 text-primary-foreground/90">
              <Shield className="w-4 h-4" /> Secure platform
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold">Create account</h2>
            <p className="text-muted-foreground">Join SmartLearn today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-xl bg-card"
            />

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-xl bg-card"
            />

            {/* Password */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-xl bg-card"
            />

            {/* Confirm Password */}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full p-3 border rounded-xl bg-card"
            />

            {/* Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-xl bg-card"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>

            {/* Admin Secret (ONLY if admin) */}
            {role === "admin" && (
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Admin Secret"
                required
                className="w-full p-3 border rounded-xl bg-card"
              />
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 gradient-primary text-primary-foreground rounded-xl"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
