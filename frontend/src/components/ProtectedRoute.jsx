import { Navigate } from "react-router-dom"; // React Router component for redirecting
import { useAuth } from "../context/AuthContext"; // Custom hook to access authentication context

// ProtectedRoute component - Higher-order component that wraps routes requiring authentication
// Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get user data and loading state from auth context

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div> {/* Spinning loader */}
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />; // 'replace' prevents back button from returning to protected page
  }

  // User is authenticated - render the protected content
  return children;
};

export default ProtectedRoute;
