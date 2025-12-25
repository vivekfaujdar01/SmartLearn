import { createContext, useContext, useState, useEffect } from "react"; // React hooks for context, state, and effects
import { toast } from "sonner"; // Toast notification library for user feedback

// Create authentication context - will hold user data and auth functions
const AuthContext = createContext(null);

// AuthProvider component - Provides authentication state to all child components
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store current logged-in user data
  const [loading, setLoading] = useState(true); // Loading state while checking initial auth status

  // Effect to check for existing auth data in localStorage on app mount
  useEffect(() => {
    // Check localStorage on mount for persisted session
    const storedUser = localStorage.getItem("user"); // Get stored user data
    const token = localStorage.getItem("token"); // Get stored auth token
    
    // If both user and token exist, restore the session
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser)); // Parse and set user data from JSON string
      } catch (e) {
        // Handle corrupted localStorage data
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem("user"); // Clear invalid user data
        localStorage.removeItem("token"); // Clear token
      }
    }
    setLoading(false); // Auth check complete, stop loading
  }, []);

  // Function to log in user - stores user data and token
  const login = (userData, token) => {
    setUser(userData); // Update user state
    localStorage.setItem("user", JSON.stringify(userData)); // Persist user data to localStorage
    localStorage.setItem("token", token); // Persist token to localStorage
    toast.success(`Welcome back, ${userData.name}!`); // Show welcome notification
  };

  // Function to log out user - clears all auth data
  const logout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem("user"); // Remove user data from localStorage
    localStorage.removeItem("token"); // Remove token from localStorage
    toast.success("Logged out successfully", { duration: 1000 }); // Show logout notification
    // Optional: Navigate to home or login?
    // window.location.href = "/"; // or use useNavigate if inside router context
  };

  // Function to update user data - used for profile updates
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }; // Merge existing user with updated data
    setUser(newUser); // Update user state
    localStorage.setItem("user", JSON.stringify(newUser)); // Persist updated user to localStorage
  };

  // Provide auth context values to all child components
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context - use this in components to get auth state/functions
export const useAuth = () => useContext(AuthContext);
